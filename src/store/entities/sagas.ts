import { all } from 'redux-saga/effects';

import * as author from './Author';
import * as book from './Book';

export default function* sagas() {
	yield all([author.sagas(), book.sagas()]);
}
