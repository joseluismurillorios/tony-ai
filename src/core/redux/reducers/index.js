import { combineReducers } from 'redux';
import common from './common';
import forecast from './forecast';

const reducers = combineReducers({
  common,
  forecast,
});

export default reducers;
