import merge from 'lodash/merge';
import { expectSaga } from 'redux-saga-test-plan';

import i18n from '@src/lib/i18n';
import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/app/notifications';
import { State } from '@src/store/types';
import { Notification, QueueNotification } from '@src/types/notification';

const notification: Notification = {
	text: "notification_text",
	level: "info"
};

const queueNotification: QueueNotification = {
	id: 1,
	text: "notification_text",
	level: "info"
};

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('TenantListMentions reducer', () => {

	it('reducer queue notification from empty queue', () => {
		expect(reducers(
			getFullState(),
			operators.queue({ notification: queueNotification })
		).app.notifications)
			.toMatchObject({
				queue: [queueNotification],
				nextId: 2
			});
	});

	it('reducer queue notification from not empty queue', () => {
		const newNotification = { ...queueNotification, id: 2 };
		expect(reducers(
			getFullState({ app: { notifications: { queue: [queueNotification], nextId: 2 } } }),
			operators.queue({ notification: newNotification })
		).app.notifications)
			.toMatchObject({
				queue: [queueNotification, newNotification],
				nextId: 3
			});
	});

	it('reducer unqueue notification from not empty queue', () => {
		expect(reducers(
			getFullState({ app: { notifications: { queue: [queueNotification], nextId: 2 } } }),
			operators.unqueue()
		).app.notifications)
			.toMatchObject({
				queue: [],
				nextId: 1
			});
	});

	it('reducer unqueue notification from empty queue', () => {
		expect(reducers(
			getFullState(),
			operators.unqueue()
		).app.notifications)
			.toMatchObject({
				queue: [],
				nextId: 1
			});
	});

	it('saga should queue simple notification', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: queueNotification }))
			.dispatch(operators.add({ notification }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [queueNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should queue false timeout notification', () => {
		const falseTimeoutQueueNotification = { ...queueNotification, timeout: false } as QueueNotification;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: falseTimeoutQueueNotification }))
			.dispatch(operators.add({ notification: { ...notification, timeout: false } }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [falseTimeoutQueueNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should queue defined timeout notification', () => {
		const definedTimeoutQueueNotification = { ...queueNotification, timeout: 10000 } as QueueNotification;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: definedTimeoutQueueNotification }))
			.dispatch(operators.add({ notification: { ...notification, timeout: 10000 } }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [definedTimeoutQueueNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should queue default level notification', () => {
		const text = "notification_text";
		const defaultLevelNotification = { id: 1, text, level: 'info' } as QueueNotification;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: defaultLevelNotification }))
			.dispatch(operators.add({ notification: { text } }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [defaultLevelNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should queue translated notification', () => {
		const text = 'notification_text';
		i18n.addResourceBundle(i18n.language, 'translation', { _testText: text });
		const translatedQueueNotification = { ...queueNotification, text } as QueueNotification;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: translatedQueueNotification }))
			.dispatch(operators.add({ notification: { t: '_testText' } }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [translatedQueueNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should queue buttonText notification', () => {
		const buttonTextQueueNotification = { ...queueNotification, buttonText: 'some_text' } as QueueNotification;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: buttonTextQueueNotification }))
			.dispatch(operators.add({ notification: { ...notification, buttonText: 'some_text' } }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [buttonTextQueueNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should queue buttonIcon notification', () => {
		const buttonIconQueueNotification = { ...queueNotification, buttonIcon: 'person' } as QueueNotification;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: buttonIconQueueNotification }))
			.dispatch(operators.add({ notification: { ...notification, buttonIcon: 'person' } }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [buttonIconQueueNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should queue buttonIcon and buttonText notification', () => {
		const buttonIconQueueNotification = { ...queueNotification, buttonIcon: 'person' } as QueueNotification;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.queue({ notification: buttonIconQueueNotification }))
			.dispatch(operators.add({ notification: { ...notification, buttonIcon: 'person', buttonText: 'some_text' } }))
			.hasFinalState(getFullState({
				app: {
					notifications: {
						queue: [buttonIconQueueNotification],
						nextId: 2
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});
});
