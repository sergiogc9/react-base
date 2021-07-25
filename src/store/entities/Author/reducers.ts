import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getEntityFetchReducers } from '@sergiogc9/react-utils';

import { Author, State } from './types';

const entityAdapter = createEntityAdapter<Author>();

export const INITIAL_STATE: State = entityAdapter.getInitialState({
	status: 'pending'
});

const [fetchAuthorsStart, fetchAuthorsSuccess, fetchAuthorsError] = getEntityFetchReducers<Author>();

const { actions, reducer } = createSlice({
	name: '@@entities/author',
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
		fetchAuthorsStart,
		fetchAuthorsSuccess,
		fetchAuthorsError
	}
});

export { actions, reducer, entityAdapter };
