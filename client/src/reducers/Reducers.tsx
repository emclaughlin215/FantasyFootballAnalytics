import { combineReducers } from 'redux';

import { GlobalReducer, IGlobalReducer } from './GlobalReducers';

export interface ICombinedReducers {
  GlobalReducer: IGlobalReducer;
}

export default combineReducers({
  GlobalReducer,
});
