import { createSelector } from 'reselect';

import { State } from 'store/types';

const rootSelector = (state: State) => state.ui.counter;

export default {
	getRootState: rootSelector,
	getValue: createSelector(rootSelector, state => state.value)
};
