import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, delay as effectDelay, put, takeLatest } from 'redux-saga/effects';

import counterSagas from './counter/sagas';
import { actions, Payloads } from './reducers';

export default function* sagas() {
	yield all([
		takeLatest(actions.fetchDataStart.type, fetch),
		counterSagas()
	]);
}

function* fetch({ payload: number }: PayloadAction<Payloads['fetchData']>) {
	yield call(delay, 3000);
	yield put(actions.fetchDataSuccess());
}

/* istanbul ignore next */
export function* delay(ms: number) {
	yield effectDelay(ms);
};
