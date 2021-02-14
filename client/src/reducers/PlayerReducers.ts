import { constants } from '../constants';
import { IDisplayTeam, IPlayer } from '../index.d';
import { loaded, loading, LoadState } from '../utils/LoadState';

export interface IPlayerReducer {
  playerListLatest: LoadState<IPlayer[]>,
  playerList: LoadState<IPlayer[]>,
  filteredPlayerLatest: LoadState<IPlayer[]>,
  filteredPlayer: LoadState<IPlayer[]>,
  selectedTeam: LoadState<IDisplayTeam>,
  propertyToGraph?: keyof IPlayer,
  selectedPlayer?: IPlayer,
}

export interface IPlayerAction {
  type: string,
  payload: {
    playersLatest?: IPlayer[],
    players?: IPlayer[],
    selectedTeam?: IDisplayTeam,
    propertyToGraph?: keyof IPlayer,
    selectedPlayer?: IPlayer,
  },
}

const defaultState: IPlayerReducer = {
  playerListLatest: loading(),
  playerList: loading(),
  filteredPlayerLatest: loading(),
  filteredPlayer: loading(),
  selectedTeam: loading(),
}

export const PlayerReducer = (state = defaultState, action: IPlayerAction) => {

  switch (action.type) {
    case constants.loadPlayersLatest: {
      return {
        ...state,
        playerListLatest: loaded(action.payload["playersLatest"]),
      }
    }
    case constants.loadPlayersAll: {
      return {
        ...state,
        playerList: loaded(action.payload["players"]),
      }
    }
    case constants.filterPlayers: {
      return {
        ...state,
        filteredPlayerLatest: loaded(action.payload["playersLatest"]),
        filteredPlayer: loaded(action.payload["players"]),
      }
    }
    case constants.addPropertiesToGrpah: {
      return {
        ...state,
        propertyToGraph: action.payload['propertyToGraph'],
      }
    }
    case constants.loadSelectedTeam: {
      return {
        ...state,
        selectedTeam: loaded(action.payload['selectedTeam']),
      }
    }
    default:
      return state;
  }
}