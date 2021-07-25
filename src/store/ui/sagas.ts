import { all, call, delay as effectDelay, put, takeLatest } from 'redux-saga/effects';

import counterSagas from './counter/sagas';
import { actions } from './reducers';

/* istanbul ignore next */
export function* delay(ms: number) {
	yield effectDelay(ms);
}

function* fetch() {
	yield call(delay, 3000);
	yield put(actions.fetchDataSuccess());
}

export default function* sagas() {
	yield all([takeLatest(actions.fetchDataStart.type, fetch), counterSagas()]);
}
