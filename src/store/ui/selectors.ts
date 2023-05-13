import { createSelector } from 'reselect';
import { RootState } from 'store/types';

const rootSelector = (state: RootState) => state.ui._;

export default {
	getRootState: rootSelector,
	getIsFakeLoading: createSelector(rootSelector, state => state.isFakeLoading),
	getIsPageFullScrolled: createSelector(rootSelector, state => state.isPageFullScrolled),
	getIsPageScrolled: createSelector(rootSelector, state => state.isPageScrolled),
	getPendingLoadingBarApiCalls: createSelector(rootSelector, state => state.pendingLoadingBarApiCalls)
};
