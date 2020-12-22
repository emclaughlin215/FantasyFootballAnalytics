import { constants } from '../constants';
import { IPlayerType, ITeam } from '../index.d';
import { IGlobalAction } from '../reducers/GlobalReducers';
import { createPlayerTypeStub, createTeamStub } from '../utils/Stubs';

export const getPlayerTypeList = (
  query: string,
) => {
  return async (dispatch: Function) => {
    const res: Response = await fetch(query);
    const resJson: IPlayerType[] = await res.json();
    const allPlayerTypeStub = createPlayerTypeStub('All');
    resJson.unshift(allPlayerTypeStub);
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
    const allTeamStub = createTeamStub('All');
    resJson.unshift(allTeamStub);
    dispatch(getTeam(resJson));
  };
};

function getTeam(teams: ITeam[]): IGlobalAction {
  return {
    type: constants.loadTeams,
    payload: teams,
  }
}
