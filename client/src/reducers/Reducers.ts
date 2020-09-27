import { combineReducers } from 'redux';

import { GlobalReducer, IGlobalReducer } from './GlobalReducers';
import { IPlayerReducer, PlayerReducer } from './PlayerReducers';

export interface ICombinedReducers {
  GlobalReducer: IGlobalReducer;
  PlayerReducer: IPlayerReducer;
}

export default combineReducers({
  GlobalReducer,
  PlayerReducer,
});
