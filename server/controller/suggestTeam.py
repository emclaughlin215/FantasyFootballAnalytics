import functools


def getExpectedPoints(team, all_players_latest, period_qualifier):

    keys_to_keep = ['id', 'multiplier']
    keys_to_ignore = ['_sa_instance_state']
    elements = {x['id']: {k: v for (k, v) in x.items() if k in keys_to_keep and k not in keys_to_ignore} for x in team}
    latest_elements = {x['id']: {k: v for (k, v) in x.items() if k not in keys_to_ignore} for x in all_players_latest if x['id'] in elements}
    latest_elements = {kv[0]: dict(kv[1], **elements[kv[0]]) for kv in latest_elements.items()}
    for player in latest_elements.values():
        print(player['web_name'], ' has ', player['event_points'], ' points @ ', player['timestamp'])
    return sum(player['cost'] for player in latest_elements.values()), \
        sum(player['event_points'] * player['multiplier'] for player in latest_elements.values()), \
        sum(player['ep_' + period_qualifier] for player in latest_elements.values())


def getPositionHighestExpected(players, position, period_qualifier):

    players_in_position = list(filter(lambda x: x['element_type'] == position, players))
    return sorted(players_in_position, key=lambda x: x[period_qualifier], reverse=True)


def getHighestExpectedPoints(all_players_latest, period_qualifier, max_players_one_team=3):

    goalkeepers_sorted = getPositionHighestExpected(all_players_latest, 1, period_qualifier)  # GK
    defenders_sorted = getPositionHighestExpected(all_players_latest, 2, period_qualifier)  # Def
    midfielders_sorted = getPositionHighestExpected(all_players_latest, 3, period_qualifier)  # Mid
    forwards_sorted = getPositionHighestExpected(all_players_latest, 4, period_qualifier)  # For

    goalkeeper = goalkeepers_sorted[:2]
    other_goalkeepers = goalkeepers_sorted[2:]
    defenders = defenders_sorted[:5]
    other_defenders = defenders_sorted[6:]
    midfielders = midfielders_sorted[:5]
    other_midfielders = midfielders_sorted[6:]
    forwards = forwards_sorted[:3]
    other_forwards = forwards_sorted[4:]
    bank_of_players = {
        1: other_goalkeepers,
        2: other_defenders,
        3: other_midfielders,
        4: other_forwards,
    }

    players = goalkeeper + defenders + midfielders + forwards
    team_count = {}
    for player in players:
        team_count = add_team_players(player, team_count)

    print('getting best team')
    teams_with_too_many_players = list(filter(lambda x: len(x[1]) > max_players_one_team, list(team_count.items())))
    print('Teams with too many players ', len(teams_with_too_many_players))
    # while len(teams_with_too_many_players) > 0:
    for team_with_too_many_players in teams_with_too_many_players:
        print('changing players when too many for one team')
        team_id = team_with_too_many_players[0]
        team_proposed_changes = []
        number_of_changes_to_make = len(team_with_too_many_players[1]) - max_players_one_team
        team_players = list(filter(lambda x: x['team'] == team_id, players))
        for team_player in team_players:
            print('swapping player ', team_player['web_name'])
            next_best_player, bank_of_players = getNextBestPlayer(team_player, team_id, bank_of_players)
            print('swapped ', team_player['web_name'], ' for ', next_best_player['web_name'])
            team_proposed_changes = getRecommendedChanges(
                team_proposed_changes,
                number_of_changes_to_make,
                team_player,
                next_best_player,
                period_qualifier,
            )

        for change in team_proposed_changes:
            team_count = add_team_players(change[1], team_count)
            team_count = remove_team_players(change[0], team_count)

    teams_with_too_many_players = list(filter(lambda x: len(x[1]) > max_players_one_team, list(team_count.items())))
    print('Teams with too many players ', len(teams_with_too_many_players))

    highest_points_team = functools.reduce(lambda a, b: a + b, list(zip(*list(team_count.items())))[1])

    goalkeepers_sorted = getPositionHighestExpected(highest_points_team, 1, period_qualifier)  # GK
    defenders_sorted = getPositionHighestExpected(highest_points_team, 2, period_qualifier)  # Def
    midfielders_sorted = getPositionHighestExpected(highest_points_team, 3, period_qualifier)  # Mid
    forwards_sorted = getPositionHighestExpected(highest_points_team, 4, period_qualifier)  # For

    first_team = goalkeepers_sorted[:1] + defenders_sorted[:3] + midfielders_sorted[:3] + forwards_sorted[:1]
    fringe = defenders_sorted[3:] + midfielders_sorted[3:] + forwards_sorted[1:]
    fringe_sorted = sorted(fringe, key=lambda x: x[period_qualifier], reverse=True)
    first_team += fringe_sorted[:3]
    fringe_sorted.append(goalkeepers_sorted[1])
    formatted_team = sorted(first_team, key=lambda x: x['element_type']) + sorted(fringe_sorted[3:], key=lambda x: x['element_type'])
    [player.update({'position': idx}) for idx, player in enumerate(formatted_team)]

    return highest_points_team


def getRecommendedChanges(proposed_changes, number_of_changes_needed, player, next_best_player, period_qualifier):
    expected_loss = float(player[period_qualifier]) - float(next_best_player[period_qualifier])

    if len(proposed_changes) == number_of_changes_needed:
        proposed_changes.sort(key=lambda x: x[2], reverse=True)

    if len(proposed_changes) < number_of_changes_needed:
        proposed_changes.append((player, next_best_player, expected_loss))
    else:
        if expected_loss < proposed_changes[0][2]:
            proposed_changes[0] = (player, next_best_player, expected_loss)
            idx = 0
            while idx + 1 < number_of_changes_needed:
                if proposed_changes[idx][2] < proposed_changes[idx + 1][2]:
                    proposed_changes[idx], proposed_changes[idx + 1] = \
                        proposed_changes[idx + 1], proposed_changes[idx]
                idx += 1

    return proposed_changes


def getNextBestPlayer(player, team, bank_of_players):
    next_best_player = player

    position = player['element_type']
    while next_best_player['team'] == team and len(bank_of_players[int(position)]) > 0:
        next_best_player = bank_of_players[int(position)].pop(0)

    return next_best_player, bank_of_players


def remove_team_players(player, team_count):
    team = player['team']
    players_in_team = team_count[team]
    team_players = list(filter(lambda player_id: player_id['id'] != player['id'], players_in_team))
    if len(team_players) == 0:
        del team_count[team]
    else:
        team_count[team] = team_players
    return team_count


def add_team_players(player, team_count):
    team = player['team']
    if team not in team_count:
        team_count[team] = []
    players_in_team = team_count[team]
    players_in_team.append(player)
    team_count[team] = players_in_team
    return team_count
