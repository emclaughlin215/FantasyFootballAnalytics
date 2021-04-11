import sys
from typing import List

import requests
from sqlalchemy import func, literal
from sqlalchemy.orm import Session, aliased

import pandas as pd
import json
from datetime import datetime as dt
from server.api import models, database
from server.api.schemas import Change, SubmitTeam, SubmitTransfers
from server.controller.suggestTeam import getExpectedPoints, getHighestExpectedPoints
from server.controller.suggestTransfers import suggestTransfers


def get_game_week_info(db: Session):
    events_info = db.query(models.Events).filter(models.Events.is_previous | models.Events.is_current | models.Events.is_next).all()
    events_info = [{k: v for (k, v) in event.__dict__.items() if k != '_sa_instance_state'} for event in events_info]
    event_info = {'previous': events_info[0], 'next': events_info[-1]}
    if len(events_info) > 2:
        event_info['current'] = events_info[1]
    return event_info


def get_player_fixtures(db: Session, team_id: int, game_week: int):
    away_fixtures = db \
        .query(
            models.Fixture.home_team_id.label('opponent_id'),
            models.Fixture.home_team_name.label('opponent_name'),
            models.Fixture.team_a_difficulty.label('opponent_difficulty'),
            models.Fixture.event,
            literal('away').label('fixture_type'),
        ) \
        .filter(
            models.Fixture.away_team_id == team_id,
            models.Fixture.event > game_week,
        )

    home_fixtures = db \
        .query(
            models.Fixture.away_team_id.label('opponent_id'),
            models.Fixture.away_team_name.label('opponent_name'),
            models.Fixture.team_h_difficulty.label('opponent_difficulty'),
            models.Fixture.event,
            literal('home').label('fixture_type'),
        ) \
        .filter(
            models.Fixture.home_team_id == team_id,
            models.Fixture.event > game_week,
        )

    return home_fixtures \
        .union(away_fixtures) \
        .order_by(models.Fixture.event.asc()) \
        .all()


def get_all_players(db: Session):
    return db.query(models.Player).all()


def get_all_player(db: Session, player_id: int):
    return db.query(models.Player) \
        .filter(models.Player.id == player_id)\
        .order_by(models.Player.timestamp.desc()) \
        .all()


def get_all_players_latest(db: Session):
    row_num_col = func.row_number().over(
                order_by=models.Player.timestamp.desc(),
                partition_by=models.Player.id
            ).label('row_num')
    subquery = db \
        .query(models.Player) \
        .add_column(row_num_col) \
        .from_self() \
        .filter(row_num_col == 1) \
        .subquery()

    latest = aliased(subquery)
    result = db.query(models.Player).select_entity_from(latest).all()
    return result


def get_all_player_types(db: Session):
    return db.query(models.PlayerType).all()


def get_team_players(db: Session, team_id: int):
    return db.query(models.Player).filter(models.Player.team == team_id).all()


def get_all_teams(db: Session):
    return db.query(models.Team).all()


def get_most_transferred_in(db: Session):
    latest_players = get_all_players_latest(db)

    return sorted(latest_players, key=lambda x: x.transfers_in_event, reverse=True)


def get_most_transferred_out(db: Session):
    latest_players = get_all_players_latest(db)

    return sorted(latest_players, key=lambda x: x.transfers_out_event, reverse=True)


def get_most_selected(db: Session):
    subquery = db.query(
        models.Player,
        func.round((models.Player.selected_by_percent - func.lead(models.Player.selected_by_percent, 1).over(
            order_by=models.Player.timestamp.desc(),
            partition_by=models.Player.id
        )), 2).label('selected_by_percent_change')
    ) \
        .subquery()

    return db \
        .query(subquery) \
        .order_by(subquery.c.timestamp.desc(), subquery.c.selected_by_percent.desc()) \
        .all()


def get_picked_team(db: Session):

    picked_team = db \
        .query(models.PickedTeam) \
        .order_by(models.PickedTeam.event.desc(), models.PickedTeam.position.asc()) \
        .limit(15) \
        .all()

    return picked_team


def get_selected_team(db: Session):

    selected_team = db \
        .query(models.SelectedTeam) \
        .order_by(models.SelectedTeam.event.desc(), models.SelectedTeam.position.asc()) \
        .limit(15) \
        .all()

    return selected_team


def get_highest_team(db: Session, period_qualifier: str):
    return db \
        .query(models.HighestTeam) \
        .filter(models.HighestTeam.period_qualifier == period_qualifier) \
        .order_by(models.HighestTeam.event.desc(), models.HighestTeam.position.asc()) \
        .limit(15) \
        .all()


def get_picked_expected_points(db: Session):
    picked_team = {player.__dict__['position']: player.__dict__ for player in get_picked_team(db)}
    picked_team_list = [player.__dict__ for player in get_picked_team(db)]
    all_latest = [player.__dict__ for player in get_all_players_latest(db)]

    pt = getExpectedPoints(picked_team_list, all_latest, 'this')
    return {
        'team': picked_team,
        'cost': round(pt[0], 2),
        'actual_points': round(pt[1], 2),
        'expected_points': round(pt[2], 2),
    }


def get_selected_expected_points(db: Session):
    selected_team = {player.__dict__['position']: player.__dict__ for player in get_selected_team(db)}
    selected_team_list = [player.__dict__ for player in get_selected_team(db)]
    all_latest = [player.__dict__ for player in get_all_players_latest(db)]

    st = getExpectedPoints(selected_team_list, all_latest, 'next')
    return {
        'team': selected_team,
        'cost': round(st[0], 2),
        'actual_points': round(st[1], 2),
        'expected_points': round(st[2], 2),
    }


def get_highest_expected_points(db: Session, period_qualifier: str):
    highest_team = {player.__dict__['position']: player.__dict__ for player in get_highest_team(db, 'ep_' + period_qualifier)}
    highest_team_list = [player.__dict__ for player in get_highest_team(db, 'ep_' + period_qualifier)]

    cost = sum(player['cost'] for player in highest_team_list)
    expected_points = sum(player['ep_' + period_qualifier] for player in highest_team_list)
    actual_points = sum(player['event_points'] for player in highest_team_list)
    return {
        'team': highest_team,
        'cost': round(cost, 2),
        'expected_points': round(expected_points, 2),
        'actual_points': round(actual_points, 2),
    }


def get_suggested_transfers(db: Session) -> List[Change]:
    pickedTeam = [player.__dict__ for player in get_selected_team(db)]
    suggestedTeam = [player.__dict__ for player in get_highest_team(db, 'ep_next')]

    return suggestTransfers(pickedTeam, suggestedTeam)


def handle_elements(elements: pd.DataFrame, element_types: pd.DataFrame, game_week: int) -> pd.DataFrame:
    elements['form'] = pd.to_numeric(elements['form'])
    elements['cost'] = elements['now_cost'] / 10
    elements['cost_change_start'] = elements['cost_change_start'] / 10
    elements['cost_change_event'] = elements['cost_change_event'] / 10
    elements['form_to_cost'] = elements['form'] / elements['cost']
    elements['bonus_to_cost'] = elements['bonus'] / elements['cost']
    elements['element_name'] = elements.element_type.map(element_types.set_index('id').singular_name)
    elements['element_name_short'] = elements.element_type.map(element_types.set_index('id').singular_name_short)
    elements['timestamp'] = pd.to_datetime('now')
    elements['event'] = game_week

    primary_key_cols = ['id', 'timestamp']
    elements['primary_key'] = elements[primary_key_cols].apply(lambda row: '_'.join(row.values.astype(str)), axis=1)

    for col in float_cols:
        elements[col] = elements[col].astype('float64')
    for col in int_cols:
        elements[col] = elements[col].astype('float64')  # Cast to float and cannot cast NaNs to int.
    for col in string_cols:
        elements[col] = elements[col].astype(str)
    for col in bool_cols:
        elements[col] = elements[col].astype('bool')

    return elements


def set_highest_expected_points_team(players: dict, element_types_df: pd.DataFrame, table: str, game_week):

    hep_this = getHighestExpectedPoints(players, 'ep_this')
    highest_expected_points_this_df = pd.DataFrame(hep_this)
    highest_expected_points_this_df['period_qualifier'] = 'ep_this'

    hep_next = getHighestExpectedPoints(players, 'ep_next')
    highest_expected_points_next_df = pd.DataFrame(hep_next)
    highest_expected_points_next_df['period_qualifier'] = 'ep_next'

    highest_expected_points_df = pd.concat(
        [highest_expected_points_this_df, highest_expected_points_next_df],
        ignore_index=True
    )

    highest_expected_points_df = handle_elements(highest_expected_points_df, element_types_df, game_week)
    highest_expected_points_df['multiplier'] = 1
    highest_expected_points_df['is_captain'] = 0
    highest_expected_points_df['is_vice_captain'] = 0

    primary_key_cols = ['primary_key', 'period_qualifier']
    highest_expected_points_df['primary_key'] = highest_expected_points_df[primary_key_cols] \
        .apply(lambda row: '_'.join(row.values.astype(str)), axis=1)

    highest_expected_points_df = highest_expected_points_df[string_cols + int_cols + bool_cols + float_cols + [
        'period_qualifier',
        'event',
        'position',
        'multiplier',
        'is_captain',
        'is_vice_captain',
        'element_name',
        'timestamp'
    ]]
    highest_expected_points_df['ep_this'] = highest_expected_points_df['ep_this'].astype(float)
    highest_expected_points_df['ep_next'] = highest_expected_points_df['ep_next'].astype(float)

    try:
        highest_expected_points_df.to_sql(
            name=table,
            con=database.cnx,
            if_exists='replace',
            index=True)
    except ValueError as vx:
        print(vx)
    except Exception as ex:
        print(ex)
    else:
        print(table + " table created successfully.")

    return 'Successfully updated the highest expected points team.'


def set_team(
        url: str,
        headers: dict,
        players: pd.DataFrame,
        table: str):

    try:
        team = requests.get(url, headers=headers)
    except ConnectionError:
        sys.exit("Failed to get team points data.")

    team_json = team.json()
    if team_json == 'The game is being updated.':
        return

    team_df = pd.DataFrame(team_json['picks'])
    team_df = pd.merge(players, team_df, left_on='id', right_on='element', how='left')

    for col in float_cols:
        team_df[col] = team_df[col].astype('float64')
    for col in int_cols:
        team_df[col] = team_df[col].astype('float64')
    for col in string_cols:
        team_df[col] = team_df[col].astype(str)
    for col in bool_cols:
        team_df[col] = team_df[col].astype('bool')

    primary_key_cols = ['id', 'event']
    team_df['primary_key'] = team_df[primary_key_cols] \
        .apply(lambda row: '_'.join(row.values.astype(str)), axis=1)

    try:
        team_df.to_sql(name=table, con=database.cnx, if_exists='replace', index=True)
    except ValueError as vx:
        print(vx)
    except Exception as ex:
        print(ex)
    else:
        print(table + " table created successfully.")


def update_events():
    url_data = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    try:
        response_data = requests.get(url_data)
    except ConnectionError:
        sys.exit("Failed to get data from the FPL API")

    data_json = response_data.json()
    events = data_json['events']
    events_df = pd.DataFrame(events)

    set_events(events_df, 'events')

    return 'Events Table Updated!'


def set_events(events_df: pd.DataFrame, table_name: str):

    events_df = events_df.drop(['chip_plays', 'top_element_info'], axis=1)

    try:
        events_df.to_sql(name=table_name, con=database.cnx, if_exists='replace', index=True)
    except ValueError as vx:
        print(vx)
    except Exception as ex:
        print(ex)
    else:
        print(table_name + " table created successfully.")


def pandas_latest_window(data: pd.DataFrame, partition_key: str, order_key: str):
    data['row_number'] = data \
        .groupby(by=[partition_key])[order_key] \
        .transform(lambda x: x.rank(method='first'))

    data_latest = data[data['row_number'] == 1]
    return data_latest.drop('row_number', axis=1, inplace=False)


def set_elements(data: pd.DataFrame, table_name: str, gameweek: int):

    delete_gameweek_query = 'DELETE FROM ' + table_name + ' WHERE event = ' + str(gameweek) + ';'
    database.cnx.execute(delete_gameweek_query)

    try:
        data.to_sql(name=table_name, con=database.cnx, if_exists='append', index=True)
    except ValueError as vx:
        print(vx)
    except Exception as ex:
        print(ex)
    else:
        print(table_name + " table updated successfully.")


def update_players_set_teams():
    url_data = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    try:
        response_data = requests.get(url_data)
    except ConnectionError:
        sys.exit("Failed to get data from the FPL API")
    data_json = response_data.json()

    now = dt.now()
    events = data_json['events']
    game_week = list(filter(lambda x: dt.strptime(x['deadline_time'], "%Y-%m-%dT%H:%M:%SZ") < now, events))[-1]['id']

    events_df = pd.DataFrame(events)
    elements_df = pd.DataFrame(data_json['elements'])
    element_types_df = pd.DataFrame(data_json['element_types'])
    elements_df = handle_elements(elements_df, element_types_df, game_week)

    url_points_team = 'https://fantasy.premierleague.com/api/entry/5626217/event/' + str(game_week) + '/picks/'
    url_selected_team = 'https://fantasy.premierleague.com/api/my-team/5626217/'

    set_team(url_selected_team, HEADERS, elements_df, 'selected_team')
    set_team(url_points_team, {}, elements_df, 'picked_team')
    set_highest_expected_points_team(
        data_json['elements'],
        element_types_df,
        'highest_expected_points',
        game_week,
    )
    set_elements(elements_df, 'elements', game_week)
    set_events(events_df, 'events')

    return 'Successfully updated players and teams'


def submit_team(team_to_submit: SubmitTeam):

    try:
        response = requests.post(
            'https://fantasy.premierleague.com/api/my-team/5626217/',
            headers=HEADERS,
            json=json.loads(team_to_submit.json()),
        )
    except ConnectionError:
        sys.exit("Failed to get data from the FPL API")

    if response.status_code == 200:
        return 'Successfully'
    else:
        return 'Unsuccessful: Error Code ' + str(response.status_code) + ' - ' + str(response.json())


def submit_transfers(transfers_to_submit: SubmitTransfers):

    transfers_to_submit.entry = 5626217

    print(transfers_to_submit)

    try:
        response = requests.post(
            'https://fantasy.premierleague.com/api/transfers/',
            headers=HEADERS,
            json=json.loads(transfers_to_submit.json()),
        )
    except ConnectionError:
        sys.exit("Failed to get data from the FPL API")

    if response.status_code == 200:
        return 'Successfully'
    else:
        return 'Unsuccessful: Error Code ' + str(response.status_code) + ' - ' + str(response.json())


def get_metdata():

    url_selected_team = 'https://fantasy.premierleague.com/api/my-team/5626217/'

    try:
        team = requests.get(url_selected_team, headers=HEADERS)
    except ConnectionError:
        sys.exit("Failed to get team points data.")

    team_json = team.json()
    if team_json == 'The game is being updated.':
        return

    return {key: team_json[key] for key in ['chips', 'transfers']}


def update_fixtures():

    teams_df = pd.read_sql(
        sql='''
            SELECT
                id as team_id,
                code as team_code,
                name as team_name,
                position as team_position,
                strength as team_strength
            FROM
                teams
            ''',
        con=database.cnx)

    global fixtures_df

    url_fixtures = 'https://fantasy.premierleague.com/api/fixtures/?event='
    table_name = 'fixtures'

    home_teams_df = teams_df.add_prefix('home_')
    away_teams_df = teams_df.add_prefix('away_')

    for gw in range(1, 38):
        gw_fixtures = url_fixtures + str(gw)

        try:
            response_data = requests.get(gw_fixtures)
        except ConnectionError:
            sys.exit("Failed to get fixtures from the FPL API")
        fixtures_json = response_data.json()

        if gw == 1:
            fixtures_df = pd.DataFrame(fixtures_json)
        else:
            fixtures_df = pd.concat([fixtures_df, pd.DataFrame(fixtures_json)], ignore_index=True)

    primary_key_cols = ['code', 'event']
    fixtures_df['fixture_id'] = fixtures_df[primary_key_cols] \
        .apply(lambda row: '_'.join(row.values.astype(str)), axis=1)
    fixtures_df.drop(['stats'], axis=1, inplace=True)

    fixtures_df = fixtures_df.merge(home_teams_df, left_on='team_h', right_on='home_team_id', how='inner')
    fixtures_df = fixtures_df.merge(away_teams_df, left_on='team_a', right_on='away_team_id', how='inner')

    try:
        fixtures_df.to_sql(name=table_name, con=database.cnx, if_exists='replace', index=True)
    except ValueError as vx:
        print(vx)
    except Exception as ex:
        print(ex)
    else:
        print(table_name + " table created successfully.")


HEADERS = {"Cookie": 'pl_profile=""eyJzIjogIld6SXNNemt5TlRRME9GMDoxa1dKRXI6c2VKVmN6bXpPellyR05JS0FNbmp0UF95NTBZ'
                     'IiwgInUiOiB7ImlkIjogMzkyNTQ0OCwgImZuIjogIkVkd2FyZCIsICJsbiI6ICJNY2xhdWdobGluIiwgImZjIjogMT'
                     'R9fQ==""; csrftoken=0kcum42jQOMSGw6OtDjHtdW85c3crJ73MI68b9se45Vpa0UNpVN9FgDviFOeL8Xl;'
                     'sessionid=.eJyrVopPLC3JiC8tTi2Kz0xRslIytjQyNTGxUNJBlklKTM5OzQNJF-SkFeTogWT0AnxCgXLFwcH-'
                     'jkAuqoaMxOIMoGpLQxPLxLRUc2Mjs5SUVPMUQ2PDVDNjUwtDS7NkA8NUQwMLE4vUNENLpVoAXDgrvg:1kWJEs:'
                     '12mlMhGcJj_p23Lmq-psC4Lur2k"'}

float_cols = [
    'ep_this',
    'ep_next',
    'points_per_game',
    'selected_by_percent',
    'value_form',
    'value_season',
    'threat',
    'influence',
    'creativity',
    'ict_index',
    'form_to_cost',
    'bonus_to_cost',
    'cost',
    'now_cost',
    'form',
    'chance_of_playing_this_round',
    'chance_of_playing_next_round',
    'cost_change_event',
    'cost_change_event_fall',
    'cost_change_start',
    'cost_change_start_fall',
]

int_cols = [
    'id',
    'code',
    'dreamteam_count',
    'element_type',
    'event_points',
    'squad_number',
    'team',
    'team_code',
    'total_points',
    'transfers_in',
    'transfers_in_event',
    'transfers_out',
    'transfers_out_event',
    'minutes',
    'goals_scored',
    'assists',
    'clean_sheets',
    'goals_conceded',
    'own_goals',
    'penalties_saved',
    'penalties_missed',
    'yellow_cards',
    'red_cards',
    'saves',
    'bonus',
    'bps',
    'influence_rank',
    'influence_rank_type',
    'creativity_rank',
    'creativity_rank_type',
    'threat_rank',
    'threat_rank_type',
    'ict_index_rank',
    'ict_index_rank_type',
    'corners_and_indirect_freekicks_order',
    'direct_freekicks_order',
    'penalties_order',
]
string_cols = [
    'primary_key',
    'element_name',
    'element_name_short',
    'first_name',
    'second_name',
    'news',
    'news_added',
    'photo',
    'status',
    'web_name',
    'corners_and_indirect_freekicks_text',
    'direct_freekicks_text',
    'penalties_text',
]
bool_cols = [
    'in_dreamteam',
    'special',
]