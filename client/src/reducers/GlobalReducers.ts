import { constants } from '../constants';
import { IPlayerType, ITeam } from '../index.d';
import { loaded, loading, LoadState } from '../utils/LoadState';

export interface IGlobalReducer {
  teamList: LoadState<ITeam[]>,
  playerTypeList: LoadState<IPlayerType[]>,
}

export interface ITeamAction {
  type: string,
  payload: ITeam[],
}

export interface IPlayerTypeAction {
  type: string,
  payload: IPlayerType[],
}

export type IGlobalAction = ITeamAction | IPlayerTypeAction;

const defaultState: IGlobalReducer = {
  playerTypeList: loading(),
  teamList: loading(),
}

export const GlobalReducer = (state = defaultState, action: IGlobalAction) => {

  switch (action.type) {
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