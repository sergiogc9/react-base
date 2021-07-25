import { all, call, delay as effectDelay, put, takeLatest, select } from 'redux-saga/effects';

import { actions } from './reducers';
import selectors from './selectors';

/* istanbul ignore next */
export function* delay(ms: number) {
	yield effectDelay(ms);
}

function* fetchAndTriple() {
	const value: number = yield select(selectors.getValue);

	yield call(delay, 3000);
	yield put(actions.fetchCounterSuccess(value * 3));
}

export default function* sagas() {
	yield all([takeLatest(actions.fetchCounterStart.type, fetchAndTriple)]);
}
