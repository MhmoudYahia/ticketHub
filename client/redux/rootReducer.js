// rootReducer.js

import { combineReducers } from 'redux';
import alertReducer from './alertSlice';
const rootReducer = combineReducers({
  alert: alertReducer, // Add the alert reducer here
});

export default rootReducer;
