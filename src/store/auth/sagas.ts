import { PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { UserProfile } from 'types/entities/user';
import authManager from 'lib/auth';

import { actions, Payloads } from './reducers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* startAuth({ payload }: PayloadAction<Payloads['fetchAuth']>) {
	try {
		let user: UserProfile | null = yield authManager.getUser();
		if (!user) user = yield authManager.doLogin();

		yield put(actions.setProfile(user));
		yield put(actions.fetchAuthSuccess());
	} catch (e: any) {
		// eslint-disable-next-line no-console
		console.error(`Error authenticating: ${e.message}`);
		yield put(actions.fetchAuthError(e));
		yield put(actions.setProfile(null));
	}
}

export default function* sagas() {
	yield all([takeLatest(actions.fetchAuth.type, startAuth)]);
}
