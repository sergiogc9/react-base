import MockDate from 'mockdate';

import { reducers } from 'store';
import { actions, INITIAL_STATE } from 'store/notifications';
import selectors from 'store/notifications/selectors';
import { getFullState, getStore } from 'lib/tests/redux';
import { Notification } from 'types/notification';

let store = getStore();

const notification: Notification = {
	text: 'Fake notification',
	level: 'success'
};

describe('Notifications store', () => {
	beforeAll(() => {
		Math.random = () => 0.12345;
		MockDate.set(123456789);
	});

	afterAll(() => {
		MockDate.reset();
	});

	it('should have initial state', () => {
		expect(getFullState().notifications).toMatchObject(INITIAL_STATE);
	});

	it('should add a new notification', () => {
		expect(reducers(getFullState(), actions.addNotification(notification)).notifications).toMatchObject({
			items: { 123456789123450: notification }
		});
	});

	it('should remove a notification', () => {
		expect(
			reducers(
				getFullState({
					notifications: { items: { 123456789123450: notification } }
				}),
				actions.removeNotification('123456789123450')
			).notifications
		).toMatchObject({
			items: {}
		});
	});

	it('should call getNotifications selector', () => {
		store = getStore();
		expect(selectors.getNotifications(store.getState())).toEqual({});
		store.dispatch(actions.addNotification(notification));
		expect(selectors.getNotifications(store.getState())).toEqual({
			123456789123450: notification
		});
	});
});
