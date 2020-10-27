import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import sagas from 'store/sagas';
import { getMiddleware, sagaMiddleware } from 'middleware';
import { State } from './types';

import * as entities from './entities';
import * as notifications from './notifications';
import * as ui from './ui';

// create reducers
export const reducers = combineReducers({
	entities: entities.reducer,
	notifications: notifications.reducer,
	ui: ui.reducer
});

export const store = createStore(reducers, composeWithDevTools(getMiddleware()));
export const INITIAL_STATE: State = store.getState();

sagaMiddleware.run(sagas);
