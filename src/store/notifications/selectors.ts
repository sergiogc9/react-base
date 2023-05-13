import { createSelector } from 'reselect';
import { RootState } from 'store/types';

const rootSelector = (state: RootState) => state.notifications;

export default {
	getRootState: rootSelector,
	getNotifications: createSelector(rootSelector, state => state.items)
};
