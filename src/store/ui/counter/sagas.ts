import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, delay as effectDelay, put, takeLatest, select } from 'redux-saga/effects';

import { actions, Payloads } from './reducers';
import selectors from './selectors';


export default function* sagas() {
	yield all([
		takeLatest(actions.fetchCounterStart.type, fetchAndTriple)
	]);
}

function* fetchAndTriple({ payload: number }: PayloadAction<Payloads["fetchCounterStart"]>) {
	const value = yield select(selectors.getValue);

	yield call(delay, 3000);
	yield put(actions.fetchCounterSuccess(value * 3));
}

/* istanbul ignore next */
export function* delay(ms: number) {
	yield effectDelay(ms);
};
