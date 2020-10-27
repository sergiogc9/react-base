import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getEntityFetchReducers } from 'lib/store/reducer';

import { Book, State } from './types';

const entityAdapter = createEntityAdapter<Book>();

export const INITIAL_STATE: State = entityAdapter.getInitialState({ status: 'pending' });

const [fetchBooksStart, fetchBooksSuccess, fetchBooksError] = getEntityFetchReducers<Book>();

const { actions, reducer } = createSlice({
	name: '@@entities/book',
	initialState: INITIAL_STATE,
	reducers: {
		addOne: entityAdapter.addOne,
		addMany: entityAdapter.addMany,
		setAll: entityAdapter.setAll,
		removeOne: entityAdapter.removeOne,
		removeMany: entityAdapter.removeMany,
		updateOne: entityAdapter.updateOne,
		updateMany: entityAdapter.updateMany,
		upsertOne: entityAdapter.upsertOne,
		upsertMany: entityAdapter.upsertMany,
		fetchBooksStart, fetchBooksSuccess, fetchBooksError
	}
});

export { actions, reducer, entityAdapter };
