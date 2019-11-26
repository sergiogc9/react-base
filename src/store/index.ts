import { createBrowserHistory } from 'history';
import isEqual from 'lodash/isEqual';
import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { all } from 'redux-saga/effects';

import { connectRouter } from 'connected-react-router';

import { connectApi } from '@src/lib/ajax/Api';
import { getMiddleware, sagaMiddleware } from '@src/middleware';
import { State } from './types';

import * as app from './app';

const INITIAL_STATE: State = {
	app: app.INITIAL_STATE,
	router: { action: "POP", location: { hash: "", pathname: "/", search: "", state: undefined } }
};

// define sagas generator function to register all sagas
function* sagas() {
	yield all([
		app.sagas()
	]);
}

const history = createBrowserHistory();
// patch to avoid stacking same location multiple times in history
const historyPush = history.push;
let lastLocation = history.location;
history.listen(location => lastLocation = location);
history.push = (path: any, state: object = {}): void => {
	const lastPath = lastLocation.pathname + lastLocation.hash + lastLocation.search;
	if (lastLocation === null || path !== lastPath || !isEqual(state, lastLocation.state)) historyPush(path, state);
};

// create reducers

const reducers = combineReducers({
	app: app.reducers,
	router: connectRouter(history)
});

const store = createStore(reducers, composeWithDevTools(getMiddleware(history)));
connectApi(store);

sagaMiddleware.run(sagas);

export { INITIAL_STATE, sagas, history, reducers, store };
