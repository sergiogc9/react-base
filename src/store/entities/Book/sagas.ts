import { all, call, delay as effectDelay, put, takeLatest } from 'redux-saga/effects';

import { actions } from './reducers';
import { Book } from './types';


export default function* sagas() {
	yield all([
		takeLatest(actions.fetchBooksStart.type, fetchBooks)
	]);
}

function* fetchBooks() {
	// Simulate API call
	yield call(delay, 1000);
	const books: Book[] = [{ id: 'book-1', title: 'Book awesome' }, { id: 'book-2', title: 'Book not bad' }];
	yield put(actions.addMany(books));
	yield put(actions.fetchBooksError({ code: 'FAKE_CODE', message: 'A fake API error has been thrown! 😄' }));
}

/* istanbul ignore next */
export function* delay(ms: number) {
	yield effectDelay(ms);
};
