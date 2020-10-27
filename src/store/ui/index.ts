import { combineReducers } from '@reduxjs/toolkit';

import * as _root from './reducers';
import * as counter from './counter';

export const reducer = combineReducers({
	_: _root.reducer,
	counter: counter.reducer
});

export interface State {
	_: _root.State,
	counter: counter.State;
}

export const INITIAL_STATE = {
	_: _root.INITIAL_STATE,
	counter: counter.INITIAL_STATE
};

const actions = _root.actions;
export { actions };
