import { constants } from '../constants';
import { IDisplayTeam, IPlayer } from '../index.d';
import { IPlayerAction } from '../reducers/PlayerReducers';

export const getPlayerLatestList = (
  query: string,
) => {
  return async (dispatch: Function) => {
    const res: Response = await fetch(query);
    const resJson: IPlayer[] = await res.json();
    dispatch(getPlayerLatest(resJson));
  };
};

function getPlayerLatest(players: IPlayer[]): IPlayerAction {
  return {
    type: constants.loadPlayersLatest,
    payload: { "playersLatest": players },
  }
}

export const getPlayerList = (
  query: string,
) => {
  return async (dispatch: Function) => {
    const res: Response = await fetch(query);
    const resJson: IPlayer[] = await res.json();
    dispatch(getPlayer(resJson));
  };
};

function getPlayer(players: IPlayer[]): IPlayerAction {
  return {
    type: constants.loadPlayersAll,
    payload: { "players": players },
  }
}


export const getSelectedTeam = (query: string) => {
  return async (dispatch: Function) => {
    const res: Response = await fetch(query);
    const resJson: IDisplayTeam = await res.json();
    dispatch(setSelected(resJson, constants.loadSelectedTeam));
  }
}

export function setSelected(displayTeam: IDisplayTeam, type: string): IPlayerAction {
  return {
    type: type,
    payload: { "selectedTeam": displayTeam },
  }
}


export const setFilteredPlayerList = (filteredPlayersLatest: IPlayer[], filteredPlayers: IPlayer[]): IPlayerAction => {
  return {
    type: constants.filterPlayers,
    payload: {
      "playersLatest": filteredPlayersLatest,
      "players": filteredPlayers,
    }
  }
}

export const addPropertiesToGraph = (propertiesToAdd: keyof IPlayer): IPlayerAction => {
  return {
    type: constants.addPropertiesToGrpah,
    payload: {
      'propertyToGraph': propertiesToAdd,
    },
  }
}
