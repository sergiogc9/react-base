import { createSelector } from 'reselect';
import { State } from 'store/types';

const rootSelector = (state: State) => state.ui._;

export default {
	getRootState: rootSelector,
	getIsFakeLoading: createSelector(rootSelector, state => state.isFakeLoading),
	getIsPageScrolled: createSelector(rootSelector, state => state.isPageScrolled)
};
