/* eslint-disable @typescript-eslint/naming-convention */
import configureMockStore from 'redux-mock-store';
import find from 'lodash/find';

import middleware from 'middleware/api/redux';
import { Notification } from 'types/notification';
import { actions } from 'store/notifications';
import { actions as uiActions } from 'store/ui';

// eslint-disable-next-line no-console
const consoleError = console.error;
const mockStore = configureMockStore([middleware]);
let store = mockStore();

jest.mock('config/api/success', () => ({
	redux: {
		api_actions_group: {
			API_CALL_ACTION_1: {
				text: 'Success raw text',
				level: 'success'
			},
			API_CALL_ACTION_2: {
				t: 'success_translation_key',
				level: 'success'
			}
		}
	}
}));

jest.mock('config/api/error', () => ({
	common: {
		COMMON_ERROR: {
			t: 'common_error',
			level: 'warning'
		},
		API_ERROR_1: {
			t: 'this.error.should.never.be.shown',
			level: 'warning'
		},
		DISABLED_COMMON_ERROR_CODE: false
	},
	redux: {
		api_actions_group: {
			API_ERROR_ACTION: {
				API_ERROR_1: {
					text: { path: 'message' },
					level: 'warning'
				},
				API_ERROR_2: {
					t: 'translation_key',
					level: 'info'
				},
				API_USER_ERROR: {
					t: ['user_error_translation', { user: { path: 'user' } }],
					level: 'error'
				},
				API_USER_ERROR_2: {
					t: ['user_error_translation_2', { user: 'The user call failed' }],
					level: 'warning'
				},
				DISABLED_ERROR_CODE: false
			},
			DISABLED_ERROR_ACTION: false
		},
		disabled_action_group: false
	}
}));

const buildApiAction = (
	status: 'start' | 'success' | 'error',
	group: string,
	name: string,
	payload: any,
	meta?: Record<string, unknown>
) => ({
	type: `${group}/${name}`,
	payload,
	meta: {
		api: status,
		...meta
	}
});

const getNotificationAction = (): Notification | null => {
	const notificationAction = find(store.getActions(), ['type', actions.addNotification.type]);
	return notificationAction ? notificationAction.payload : null;
};

const getShowLoadingBarNotificationAction = (): any | null => {
	return find(store.getActions(), ['type', uiActions.addPendingLoadingBarApiCall.type]);
};

const getRemoveLoadingBarNotificationAction = (): any | null => {
	return find(store.getActions(), ['type', uiActions.removePendingLoadingBarApiCall.type]);
};

describe('Api response middleware', () => {
	beforeAll(() => {
		// eslint-disable-next-line no-console
		console.error = jest.fn();
	});

	afterAll(() => {
		// eslint-disable-next-line no-console
		console.error = consoleError;
	});

	beforeEach(() => {
		store = mockStore();
	});

	it('should test success notification with raw text', () => {
		store.dispatch(buildApiAction('success', 'api_actions_group', 'API_CALL_ACTION_1', {}));
		expect(getNotificationAction()).toMatchObject({
			text: 'Success raw text',
			level: 'success'
		});
	});

	it('should test success notification with translation key', () => {
		store.dispatch(buildApiAction('success', 'api_actions_group', 'API_CALL_ACTION_2', {}));
		expect(getNotificationAction()).toMatchObject({
			t: 'success_translation_key',
			level: 'success'
		});
	});

	it('should test success without any notification', () => {
		store.dispatch(buildApiAction('success', 'api_actions_group', 'SOME_API_CALL_aCTION', {}));
		expect(getNotificationAction()).toBeNull();
	});

	it('should test error notification with unknown code', () => {
		const error = { code: 'API_ERROR_UNKNOWN' };
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toMatchObject({
			t: 'api.default_error',
			level: 'error'
		});
	});

	it('should test error notification on common case', () => {
		const error = { code: 'COMMON_ERROR', message: 'some common error' };
		store.dispatch(buildApiAction('error', 'some_action_group', 'SOME_ACTION_NAME', error));
		expect(getNotificationAction()).toMatchObject({
			t: 'common_error',
			level: 'warning'
		});
	});

	it('Notification should contain text response from api error object', () => {
		const error = { code: 'API_ERROR_1', message: 'api message error' };
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toMatchObject({
			text: 'api message error',
			level: 'warning'
		});
	});

	it('Notification should contain text response from api error message', () => {
		const error = { code: 'API_ERROR_2' };
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toMatchObject({
			t: 'translation_key',
			level: 'info'
		});
	});

	it('Notification error with no error code', () => {
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', {}));
		expect(getNotificationAction()).toMatchObject({
			t: 'api.default_error',
			level: 'error'
		});
	});

	it('Notification should contain error code translation', () => {
		const error = { code: 'API_ERROR_2', message: 'some api message error' };
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toMatchObject({
			t: 'translation_key',
			level: 'info'
		});
	});

	it('should test interpolation on api error response', () => {
		const error = {
			code: 'API_USER_ERROR',
			message: 'some user error message',
			user: 'username'
		};
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toMatchObject({
			t: ['user_error_translation', { user: 'username' }],
			level: 'error'
		});
	});

	it('should test interpolation without path property on api error response', () => {
		const error = {
			code: 'API_USER_ERROR_2',
			message: 'some user error message',
			user: 'username'
		};
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toMatchObject({
			t: ['user_error_translation_2', { user: 'The user call failed' }],
			level: 'warning'
		});
	});

	it('should test error notification with reload meta on api error response', () => {
		const error = {
			code: 'API_USER_ERROR_2',
			message: 'some user error message',
			user: 'username'
		};
		store.dispatch(
			buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error, {
				reload: true
			})
		);
		expect(getNotificationAction()).toMatchObject({
			t: ['user_error_translation_2', { user: 'The user call failed' }],
			level: 'warning',
			reload: true
		});
	});

	it('should not dispatch notification disabled at common error code level', () => {
		const error = {
			code: 'DISABLED_COMMON_ERROR_CODE',
			message: 'some api message error'
		};
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toEqual(null);
	});

	it('should not dispatch notification disabled at error code level', () => {
		const error = {
			code: 'DISABLED_ERROR_CODE',
			message: 'some api message error'
		};
		store.dispatch(buildApiAction('error', 'api_actions_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toEqual(null);
	});

	it('should not dispatch notification disabled at action type level', () => {
		const error = { code: 'API_ERROR_1', message: 'some api message error' };
		store.dispatch(buildApiAction('error', 'api_actions_group', 'DISABLED_ERROR_ACTION', error));
		expect(getNotificationAction()).toEqual(null);
	});

	it('should not dispatch notification disabled at action group level', () => {
		const error = { code: 'API_ERROR_1', message: 'some api message error' };
		store.dispatch(buildApiAction('error', 'disabled_action_group', 'API_ERROR_ACTION', error));
		expect(getNotificationAction()).toEqual(null);
	});

	it('should show loading at api call start', () => {
		store.dispatch(buildApiAction('start', 'test', 'TEST', {}, { showLoadingBar: true }));

		expect(getShowLoadingBarNotificationAction()).toBeTruthy();
	});

	it('should not show loading at api call start if not api action', () => {
		store.dispatch(buildApiAction('start', 'test', 'TEST', {}, { api: undefined, showLoadingBar: true }));

		expect(getShowLoadingBarNotificationAction()).toBeFalsy();
	});

	it('should hide loading at api call success', () => {
		store.dispatch(buildApiAction('success', 'test', 'TEST', {}, { showLoadingBar: true }));

		expect(getRemoveLoadingBarNotificationAction()).toBeTruthy();
	});

	it('should hide loading at api call error', () => {
		store.dispatch(buildApiAction('error', 'test', 'TEST', {}, { showLoadingBar: true }));

		expect(getRemoveLoadingBarNotificationAction()).toBeTruthy();
	});
});
