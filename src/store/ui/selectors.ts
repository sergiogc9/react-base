import { createSelector } from 'reselect';
import { State } from 'store/types';

const rootSelector = (state: State) => state.ui._;

export default {
	getRootState: rootSelector,
	getIsFakeLoading: createSelector(rootSelector, state => state.isFakeLoading),
	getIsPageFullScrolled: createSelector(rootSelector, state => state.isPageFullScrolled),
	getIsPageScrolled: createSelector(rootSelector, state => state.isPageScrolled),
	getPendingLoadingBarApiCalls: createSelector(rootSelector, state => state.pendingLoadingBarApiCalls)
};
