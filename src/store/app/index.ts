import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import * as auth from './auth';
import * as notifications from './notifications';
import * as profile from './profile';

// define sagas generator function to register all sagas
export function* sagas() {
	yield all([
		auth.sagas(),
		profile.sagas(),
		notifications.sagas()
	]);
}

export const reducers = combineReducers({
	auth: auth.reducers,
	profile: profile.reducers,
	notifications: notifications.reducers
});

export interface State {
	auth: auth.State;
	profile: profile.State;
	notifications: notifications.State;
}

export const INITIAL_STATE = {
	auth: auth.INITIAL_STATE,
	profile: profile.INITIAL_STATE,
	notifications: notifications.INITIAL_STATE
};
