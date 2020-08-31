import { constants } from '../constants';
import { loaded, loading, LoadState } from '../utils/LoadState';
import { IPlayer, IPlayerType, ITeam } from './../index.d';

export interface IGlobalReducer {
  playerList: LoadState<IPlayer[]>,
  teamList: LoadState<ITeam[]>,
  playerTypeList: LoadState<IPlayerType[]>,
}

export interface IGlobalAction {
  type: string,
  payload: IPlayer[] | IPlayerType[] | ITeam[],
}

const defaultState: IGlobalReducer = {
  playerList: loading(),
  playerTypeList: loading(),
  teamList: loading(),
}

export const GlobalReducer = (state = defaultState, action: IGlobalAction) => {

  switch (action.type) {
    case constants.loadPlayers:
      return {
        ...state,
        playerList: loaded(action.payload),
      }
    case constants.loadPlayerTypes:
      return {
        ...state,
        playerTypeList: loaded(action.payload),
      }
    case constants.loadTeams:
      return {
        ...state,
        teamList: loaded(action.payload),
      }
    default:
      return state;
  }
}