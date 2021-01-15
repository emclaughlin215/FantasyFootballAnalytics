from typing import List, Tuple, Set, Dict

from server.api.models import Player
from server.api.schemas import Transfer


def suggestTransfers(currentTeam: List[Player], suggestedTeam: List[Player]) -> List[Transfer]:

    # Position, in current team but not in suggested team, in suggested team but not in current team
    teamPositionMapping: Dict[str, Tuple[List[Player], List[Player]]] = {
        '1': ([], []),
        '2': ([], []),
        '3': ([], []),
        '4': ([], []),
    }

    currentPlayerIds = [player['id'] for player in currentTeam]
    suggestedPlayerIds = [player['id'] for player in suggestedTeam]

    for player in currentTeam:
        if player['id'] not in suggestedPlayerIds:
            teamPositionMapping[str(player['element_type'])][0].append(player)

    for player in suggestedTeam:
        if player['id'] not in currentPlayerIds:
            teamPositionMapping[str(player['element_type'])][1].append(player)

    transfers: List[Transfer] = []
    for teamPosition in teamPositionMapping.values():
        teamPosition[0].sort(key=lambda x: x['ep_next'])
        teamPosition[1].sort(key=lambda x: x['ep_next'], reverse=True)

        for p in teamPosition[0]:
            idx = 0
            while idx < len(teamPosition[1]):
                compareToPlayer: Player = teamPosition[1][idx]
                points_diff = round(compareToPlayer['ep_next'] - p['ep_next'], 2)
                cost_diff = round(compareToPlayer['cost'] - p['cost'], 2)
                make_transfer = points_diff > 0

                if make_transfer:
                    new_transfer = Transfer()

                    new_transfer.transfer_cost = cost_diff
                    new_transfer.points_gain = points_diff
                    new_transfer.id_player_in = compareToPlayer['id']
                    new_transfer.id_player_out = p['id']
                    new_transfer.first_name_player_in = compareToPlayer['first_name']
                    new_transfer.first_name_player_out = p['first_name']
                    new_transfer.web_name_player_in = compareToPlayer['web_name']
                    new_transfer.web_name_player_out = p['web_name']
                    new_transfer.second_name_player_in = compareToPlayer['second_name']
                    new_transfer.second_name_player_out = p['second_name']
                    new_transfer.cost_player_in = compareToPlayer['cost']
                    new_transfer.cost_player_out = p['cost']
                    new_transfer.ep_next_player_in = compareToPlayer['ep_next']
                    new_transfer.ep_next_player_out = p['ep_next']

                    transfers.append(new_transfer)

                idx += 1

    return sorted(transfers, key=lambda x: x.points_gain, reverse=True)

    # print('SORTED')
    # print('\n')
    # print('Midfielders players not in suggested')
    # for el in teamPositionMapping['3'][0]:
    #     print(', '.join([str(e) for e in [el['id'], el['first_name'], el['second_name'], el['ep_next']]]))
    # print('\n')
    #
    # print('Midfielders players not in my team')
    # for el in teamPositionMapping['3'][1]:
    #     print(', '.join([str(e) for e in [el['id'], el['first_name'], el['second_name'], el['ep_next']]]))
    #
    # print('\n')
    # print('\n')
    # print('TRANSFERS')
    # print('\n')
    # for t in transfers:
    #     print(', '.join([str(e) for e in [t.id_player_in, t.id_player_out, t.transfer_cost, t.points_gain]]))
