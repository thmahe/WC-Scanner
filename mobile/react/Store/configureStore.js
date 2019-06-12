// Store/configureStore.js

import {combineReducers, createStore} from 'redux';
import stateConnection from "./Reducers/stateConnectionReducer";
import stateListProject from "./Reducers/stateListProjectReducer";

export default createStore(stateConnection);