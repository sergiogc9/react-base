import { createSelector } from "reselect";
import { State } from "store/types";

const rootSelector = (state: State) => state.ui._;

export default {
	getRootState: rootSelector,
	getLoading: createSelector(rootSelector, state => state.loading)
};
