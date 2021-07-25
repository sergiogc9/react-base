import { Middleware, AnyAction } from 'redux';
import { get } from 'lib/imports/lodash';

import { actions } from 'store/notifications';
import { ApiConfigNotification, Notification } from 'types/notification';
import errorsConfig from 'config/api/error';
import successConfig from 'config/api/success';
import { defaultApiErrorNotification, getNotificationConfig, getNotificationFromConfigResult } from '.';

const __getNotificationFromConfigResult = (action: AnyAction, configResult?: ApiConfigNotification): Notification => {
	const notification = getNotificationFromConfigResult(action.payload, configResult);
	if (get(action, ['meta', 'reload'])) {
		notification.reload = true;
		notification.timeout = false;
	}
	return notification;
};

const __getNotification = (action: AnyAction): Notification | null => {
	// eslint-disable-next-line react/destructuring-assignment
	const [actionGroup, actionName] = action.type.split(/\/(?=[^/]+$)/);

	if (get(action, ['meta', 'api'], '') === 'success') {
		const configResult = getNotificationConfig('redux', successConfig, actionGroup, actionName, '');
		if (configResult) return __getNotificationFromConfigResult(action, configResult);
	} else if (get(action, ['meta', 'api'], '') === 'error') {
		const errorCode = get(action, ['payload', 'code']);
		if (!errorCode) {
			// eslint-disable-next-line no-console
			console.error('Error code not found in action:', action);
			return defaultApiErrorNotification;
		}

		const configResult = getNotificationConfig('redux', errorsConfig, actionGroup, actionName, errorCode);

		if (configResult === false) return null; // avoid notification by config

		return __getNotificationFromConfigResult(action, configResult);
	}
	return null;
};

const middleware: Middleware = store => next => (action: AnyAction) => {
	const notification = __getNotification(action);
	if (notification) store.dispatch(actions.addNotification(notification));

	next(action);
};

export default middleware;
