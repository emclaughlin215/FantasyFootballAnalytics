import functools
import sys

import requests
from sqlalchemy import func
from sqlalchemy.orm import Session

import pandas as pd
from datetime import datetime as dt
from server.dbmysql import models, database
from server.controller.suggestTeam import getExpectedPoints, getHighestExpectedPoints


def get_all_players(db: Session):
    return db.query(models.Player).all()


def get_all_players_latest(db: Session):
    return db.query(models.PlayerLatest).all()


def get_all_player_types(db: Session):
    return db.query(models.PlayerType).all()


def get_team_players(db: Session, team_id: int):
    return db.query(models.Player).filter(models.Player.team == team_id).all()


def get_all_teams(db: Session):
    return db.query(models.Team).all()


def get_most_transferred_in(db: Session):
    return db.query(models.PlayerLatest).order_by(models.PlayerLatest.transfers_in_event.desc()).limit(10).all()


def get_most_transferred_out(db: Session):
    return db.query(models.PlayerLatest).order_by(models.PlayerLatest.transfers_out_event.desc()).limit(10).all()


def get_most_selected(db: Session):
    subquery = db.query(
        models.Player,
        func.round((models.Player.selected_by_percent - func.lead(models.Player.selected_by_percent, 1).over(
            order_by=models.Player.timestamp.desc(),
            partition_by=models.Player.id
        )), 2).label('selected_by_percent_change')
    )\
        .subquery()

    return db\
        .query(subquery) \
        .order_by(subquery.c.timestamp.desc(), subquery.c.selected_by_percent.desc()) \
        .limit(10)\
        .all()


def get_picked_team(db: Session):
    return db \
        .query(models.PickedTeam) \
        .order_by(models.PickedTeam.event.desc(), models.PickedTeam.position.asc()) \
        .limit(15) \
        .all()


def get_selected_team(db: Session):
    return db \
        .query(models.SelectedTeam) \
        .order_by(models.SelectedTeam.event.desc(), models.SelectedTeam.position.asc()) \
        .limit(15) \
        .all()


def get_highest_team(db: Session):
    return db \
        .query(models.HighestTeam) \
        .order_by(models.HighestTeam.event.desc(), models.HighestTeam.position.asc()) \
        .limit(15) \
        .all()


def get_picked_expected_points(db: Session):

    picked_team = [player.__dict__ for player in get_picked_team(db)]
    all_latest = [player.__dict__ for player in get_all_players_latest(db)]

    pt = getExpectedPoints(picked_team, all_latest)
    return {
        'team': picked_team,
        'cost': pt[0],
        'expected_points': pt[1],
    }


def get_selected_expected_points(db: Session):
    selected_team = [player.__dict__ for player in get_selected_team(db)]
    all_latest = [player.__dict__ for player in get_all_players_latest(db)]

    st = getExpectedPoints(selected_team, all_latest)
    return {
        'team': selected_team,
        'cost': st[0],
        'expected_points': st[1],
    }


def get_highest_expected_points(db: Session):
    highest_team = [player.__dict__ for player in get_highest_team(db)]
    cost = functools.reduce(lambda a, b: a + b['cost'] / 10, highest_team, 0)
    points = functools.reduce(lambda a, b: a + float(b['ep_this']), highest_team, 0)
    return {
        'team': highest_team,
        'cost': cost,
        'expected_points': points
    }


def handle_elements(elements: pd.DataFrame, game_week: int) -> pd.DataFrame:

    elements['form'] = pd.to_numeric(elements['form'])
    elements['cost'] = elements['now_cost'] / 10
    elements['form_to_cost'] = elements['form'] / elements['now_cost']
    elements['bonus_to_cost'] = elements['bonus'] / elements['now_cost']
    elements['timestamp'] = pd.to_datetime('now')
    elements['event'] = game_week

    primary_key_cols = ['id', 'timestamp']
    elements['primary_key'] = elements[primary_key_cols].apply(lambda row: '_'.join(row.values.astype(str)), axis=1)

    return elements


def set_highest_expected_points_team(players: dict, player_types: pd.DataFrame, table: str, game_week: int):

    hep = getHighestExpectedPoints(players)
    highest_expected_points_df = pd.DataFrame(hep)

    highest_expected_points_df['element_name'] = highest_expected_points_df.element_type.map(player_types.set_index('id').singular_name)
    highest_expected_points_df = handle_elements(highest_expected_points_df, game_week)
    highest_expected_points_df.rename(columns={'id': 'element'}, inplace=True)
    highest_expected_points_df['multiplier'] = 0
    highest_expected_points_df['is_captain'] = 0
    highest_expected_points_df['is_vice_captain'] = 0
    highest_expected_points_df = highest_expected_points_df[[
        'primary_key',
        'element',
        'event',
        'position',
        'multiplier',
        'is_captain',
        'is_vice_captain',
        'first_name',
        'second_name',
        'element_name',
        'element_type',
        'ep_this',
        'ep_next',
        'cost',
        'event_points',
        'timestamp'
    ]]

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
        player_types: pd.DataFrame,
        table: str,
        game_week: int):

    try:
        team = requests.get(url, headers=headers)
    except ConnectionError:
        sys.exit("Failed to get team points data.")

    team_json = team.json()
    team_df = pd.DataFrame(team_json['picks'])

    players['element_name'] = players.element_type.map(player_types.set_index('id').singular_name)
    team_df['element_name'] = team_df.element.map(players.set_index('id').element_name)
    team_df['first_name'] = team_df.element.map(players.set_index('id').first_name)
    team_df['second_name'] = team_df.element.map(players.set_index('id').second_name)
    team_df['cost'] = team_df.element.map(players.set_index('id').cost)
    team_df['event_points'] = team_df.element.map(players.set_index('id').event_points)
    team_df['event'] = game_week
    team_df['timestamp'] = pd.to_datetime('now')

    primary_key_cols = ['element', 'event']
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

    elements_df = pd.DataFrame(data_json['elements'])
    elements_df = handle_elements(elements_df, game_week)
    element_types_df = pd.DataFrame(data_json['element_types'])

    headers = {"Cookie": 'pl_profile=""eyJzIjogIld6SXNNemt5TlRRME9GMDoxa1dKRXI6c2VKVmN6bXpPellyR05JS0FNbmp0UF95NTBZ'
                         'IiwgInUiOiB7ImlkIjogMzkyNTQ0OCwgImZuIjogIkVkd2FyZCIsICJsbiI6ICJNY2xhdWdobGluIiwgImZjIjogMT'
                         'R9fQ==""; csrftoken=0kcum42jQOMSGw6OtDjHtdW85c3crJ73MI68b9se45Vpa0UNpVN9FgDviFOeL8Xl;'
                         'sessionid=.eJyrVopPLC3JiC8tTi2Kz0xRslIytjQyNTGxUNJBlklKTM5OzQNJF-SkFeTogWT0AnxCgXLFwcH-'
                         'jkAuqoaMxOIMoGpLQxPLxLRUc2Mjs5SUVPMUQ2PDVDNjUwtDS7NkA8NUQwMLE4vUNENLpVoAXDgrvg:1kWJEs:'
                         '12mlMhGcJj_p23Lmq-psC4Lur2k"'}
    url_points_team = 'https://fantasy.premierleague.com/api/entry/5626217/event/' + str(game_week) + '/picks/'
    url_selected_team = 'https://fantasy.premierleague.com/api/my-team/5626217/'

    set_team(url_selected_team, headers, elements_df, element_types_df, 'selected_team', game_week)
    set_team(url_points_team, {}, elements_df, element_types_df, 'picked_team', game_week)
    set_highest_expected_points_team(data_json['elements'], element_types_df, 'highest_expected_points', game_week)

    try:
        elements_df.to_sql(name='elements', con=database.cnx, if_exists='append', index=True)
    except ValueError as vx:
        print(vx)
    except Exception as ex:
        print(ex)
    else:
        print("Elements Table created successfully.")

    return 'Successfully updated players and teams'
