import { createSelector } from 'reselect';
import { RootState } from 'store/types';

const rootSelector = (state: RootState) => state.auth;

export default {
	getRootState: rootSelector,
	isAuthenticated: createSelector(rootSelector, state => state.isAuthenticated && !!state.profile),
	getUserProfile: createSelector(rootSelector, state => state.profile)
};
