import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import find from 'lodash/find';

import middleware from '@src/middleware/apiResponse';
import { Notification } from '@src/types/notification';
import { operators as notificationOperators } from '@src/store/app/notifications/actions';

const consoleError = console.error;
const mockStore = configureMockStore([middleware]);
let store = mockStore();

jest.mock('@src/config/apiSuccess', () => (
	{
		api_actions_group: {
			API_CALL_ACTION_1: {
				text: "Success raw text",
				level: "success"
			},
			API_CALL_ACTION_2: {
				t: "success_translation_key",
				level: "success"
			}
		}
	}
));

jest.mock('@src/config/apiErrors', () => (
	{
		common: {
			COMMON_ERROR: {
				t: "common_error",
				level: "warning"
			}
		},
		api_actions_group: {
			API_ERROR_ACTION: {
				API_ERROR_1: {
					text: { path: "error.message" },
					level: 'warning'
				},
				API_ERROR_2: {
					t: "translation_key",
					level: "info"
				},
				API_USER_ERROR: {
					t: ["user_error_translation", { user: { path: "error.user" } }],
					level: "danger"
				},
				API_USER_ERROR_2: {
					t: ["user_error_translation_2", { user: "The user call failed" }],
					level: "warning"
				}
			}
		}
	}
));

const buildAction = (status: 'success' | 'error', group: string, name: string, payload: any) => ({
	type: group + '/' + name,
	payload,
	meta: {
		api: status
	}
});

const getNotificationAction = (currentStore: MockStoreEnhanced<unknown, {}>): Notification | null => {
	const notificationAction = find(currentStore.getActions(), ['type', notificationOperators.add.type]);
	return notificationAction ? notificationAction.payload.notification : null;
};

describe("Test api response middleware", () => {

	beforeAll(() => {
		console.error = jest.fn();
	});

	afterAll(() => {
		console.error = consoleError;
	});

	beforeEach(() => {
		store = mockStore();
	});

	it("Test success notification with raw text", () => {
		store.dispatch(buildAction('success', 'api_actions_group', 'API_CALL_ACTION_1', {}));
		expect(getNotificationAction(store)).toMatchObject({
			text: "Success raw text",
			level: "success"
		});
	});

	it("Test success notification with translation key", () => {
		store.dispatch(buildAction('success', 'api_actions_group', 'API_CALL_ACTION_2', {}));
		expect(getNotificationAction(store)).toMatchObject({
			t: "success_translation_key",
			level: "success"
		});
	});

	it("Test success without any notification", () => {
		store.dispatch(buildAction('success', 'api_actions_group', 'SOME_API_CALL_aCTION', {}));
		expect(getNotificationAction(store)).toBeNull();
	});

	it("Test error notification with unknown code", () => {
		const error = { code: 'API_ERROR_UNKNOWN' };
		store.dispatch(buildAction('error', 'api_actions_group', 'API_ERROR_ACTION', { error }));
		expect(getNotificationAction(store)).toMatchObject({
			t: "error.api_server.value",
			level: "danger"
		});
	});

	it("Test error notification on common case", () => {
		const error = { code: 'COMMON_ERROR', message: 'some common error' };
		store.dispatch(buildAction('error', 'some_action_group', 'SOME_ACTION_NAME', { error }));
		expect(getNotificationAction(store)).toMatchObject({
			t: "common_error",
			level: "warning"
		});
	});

	it("Notification should contain text response from api error object", () => {
		const error = { code: 'API_ERROR_1', message: 'api message error' };
		store.dispatch(buildAction('error', 'api_actions_group', 'API_ERROR_ACTION', { error }));
		expect(getNotificationAction(store)).toMatchObject({
			text: 'api message error',
			level: 'warning'
		});
	});

	it("Notification should contain text response from api error message", () => {
		const error = 'API_ERROR_2';
		store.dispatch(buildAction('error', 'api_actions_group', 'API_ERROR_ACTION', { error }));
		expect(getNotificationAction(store)).toMatchObject({
			t: "translation_key",
			level: "info"
		});
	});

	it("Notification error with no error code", () => {
		store.dispatch(buildAction('error', 'api_actions_group', 'API_ERROR_ACTION', {}));
		expect(getNotificationAction(store)).toMatchObject({
			t: "error.api_server.value",
			level: "danger"
		});
	});

	it("Notification should contain error code translation", () => {
		const error = { code: 'API_ERROR_2', message: 'some api message error' };
		store.dispatch(buildAction('error', 'api_actions_group', 'API_ERROR_ACTION', { error }));
		expect(getNotificationAction(store)).toMatchObject({
			t: "translation_key",
			level: "info"
		});
	});

	it("Test interpolation on api error response", () => {
		const error = { code: 'API_USER_ERROR', message: 'some user error message', user: 'username' };
		store.dispatch(buildAction('error', 'api_actions_group', 'API_ERROR_ACTION', { error }));
		expect(getNotificationAction(store)).toMatchObject({
			t: ["user_error_translation", { user: "username" }],
			level: "danger"
		});
	});

	it("Test interpolation without path property on api error response", () => {
		const error = { code: 'API_USER_ERROR_2', message: 'some user error message', user: 'username' };
		store.dispatch(buildAction('error', 'api_actions_group', 'API_ERROR_ACTION', { error }));
		expect(getNotificationAction(store)).toMatchObject({
			t: ["user_error_translation_2", { user: "The user call failed" }],
			level: "warning"
		});
	});
});
