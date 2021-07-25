import { createSelector } from 'reselect';
import { State } from 'store/types';

const rootSelector = (state: State) => state.notifications;

export default {
	getRootState: rootSelector,
	getNotifications: createSelector(rootSelector, state => state.items)
};
