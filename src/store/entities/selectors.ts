import { createSelector } from '@reduxjs/toolkit';

import { State as RootState } from 'store/types';

type EntityResource = 'author' | 'book';

const rootSelector = (state: RootState) => state.entities;

export default {
	getEntityFetchStatus: createSelector(
		rootSelector,
		(rootState: RootState, entityType: EntityResource) => entityType,
		(state, resource) => state[resource].status
	),
	isEntityFetched: createSelector(
		rootSelector,
		(rootState: RootState, entityType: EntityResource) => entityType,
		(state, resource) => state[resource].status === 'loaded'
	)
};
