import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { customMiddlewares, sagaMiddleware } from 'middleware';
import * as auth from './auth';
import * as entities from './entities';
import * as notifications from './notifications';
import * as ui from './ui';
import sagas from './sagas';

// create reducers
const reducers = combineReducers({
	auth: auth.reducer,
	entities: entities.reducer,
	notifications: notifications.reducer,
	ui: ui.reducer
});

const store = configureStore({
	reducer: reducers,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(...customMiddlewares)
});
const INITIAL_STATE = store.getState();

sagaMiddleware.run(sagas);

export { reducers, store, INITIAL_STATE };
