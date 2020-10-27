import { all, call, delay as effectDelay, put, takeLatest } from 'redux-saga/effects';

import { actions } from './reducers';
import { Author } from './types';


export default function* sagas() {
	yield all([
		takeLatest(actions.fetchAuthorsStart.type, fetchAuthors)
	]);
}

function* fetchAuthors() {
	// Simulate API call
	yield call(delay, 1000);
	const authors: Author[] = [{ id: 'author-1', name: 'Author awesome', books: [] }, { id: 'author-2', name: 'Author not bad', books: [] }];
	yield put(actions.addMany(authors));
	yield put(actions.fetchAuthorsSuccess());
}

/* istanbul ignore next */
export function* delay(ms: number) {
	yield effectDelay(ms);
};
