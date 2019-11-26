import { all, put, takeLatest } from 'redux-saga/effects';

import { operators } from './actions';

export function* sagas() {
	yield all([
		takeLatest(operators.fetchAuth.type, fetchAuth)
	]);
}

function* fetchAuth() {
	try {
		// TODO

	} catch (error) {
		yield put(operators.fetchAuthError({ error }));
	}
}
