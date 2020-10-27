import { createSelector } from '@reduxjs/toolkit';

import { State as RootState } from 'store/types';
import { EntityResource } from '.';

const rootSelector = (state: RootState) => state.entities;

export default {
	getEntityFetchStatus: createSelector(rootSelector, (_: RootState, entityType: EntityResource) => entityType, (state, resource) => state[resource].status),
	isEntityFetched: createSelector(rootSelector, (_: RootState, entityType: EntityResource) => entityType, (state, resource) => state[resource].status === 'loaded')
};
