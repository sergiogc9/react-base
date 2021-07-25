import { createSelector } from 'reselect';
import { State } from 'store/types';

const rootSelector = (state: State) => state.auth;

export default {
	getRootState: rootSelector,
	isAuthenticated: createSelector(rootSelector, state => state.isAuthenticated && !!state.profile),
	getUserProfile: createSelector(rootSelector, state => state.profile)
};
