import { constants } from '../constants';
import { IGlobalAction } from '../reducers/GlobalReducers';
import { IPlayer, IPlayerType, ITeam } from './../index.d';

export const getPlayerList = (
  query: string,
) => {
  return async (dispatch: Function) => {
    const res: Response = await fetch(query);
    const resJson: IPlayer[] = await res.json();
    dispatch(getPlayer(resJson));
  };
};

function getPlayer(players: IPlayer[]): IGlobalAction {
  return {
    type: constants.loadPlayers,
    payload: players,
  }
}

export const getPlayerTypeList = (
  query: string,
) => {
  return async (dispatch: Function) => {
    const res: Response = await fetch(query);
    const resJson: IPlayerType[] = await res.json();
    dispatch(getPlayerType(resJson));
  };
};

function getPlayerType(playerTypes: IPlayerType[]): IGlobalAction {
  return {
    type: constants.loadPlayerTypes,
    payload: playerTypes,
  }
}

export const getTeamList = (
  query: string,
) => {
  return async (dispatch: Function) => {
    const res: Response = await fetch(query);
    const resJson: ITeam[] = await res.json();
    dispatch(getTeam(resJson));
  };
};

function getTeam(teams: ITeam[]): IGlobalAction {
  return {
    type: constants.loadTeams,
    payload: teams,
  }
}
