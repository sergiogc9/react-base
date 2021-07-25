import { combineReducers } from '@reduxjs/toolkit';

import selectors from './selectors';
import * as author from './Author';
import * as book from './Book';

export const reducer = combineReducers({
	author: author.reducer,
	book: book.reducer
});

export interface State {
	author: typeof author.INITIAL_STATE;
	book: typeof book.INITIAL_STATE;
}

export const INITIAL_STATE = {
	author: author.INITIAL_STATE,
	book: book.INITIAL_STATE
};

export { selectors };
