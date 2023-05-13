import { createSelector } from 'reselect';

import { RootState } from 'store/types';

const rootSelector = (state: RootState) => state.ui.counter;

export default {
	getRootState: rootSelector,
	getValue: createSelector(rootSelector, state => state.value)
};
