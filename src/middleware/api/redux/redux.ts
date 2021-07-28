import { Middleware, AnyAction } from 'redux';
import { get } from 'lib/imports/lodash';

import { actions as notificationActions } from 'store/notifications';
import { actions as uiActions } from 'store/ui';
import { ApiConfigNotification, Notification } from 'types/notification';
import errorsConfig from 'config/api/error';
import successConfig from 'config/api/success';
import {
	defaultApiErrorNotification,
	getNotificationConfig,
	getNotificationFromConfigResult
} from 'middleware/api/notifications';

const __updateLoadingBar = (action: AnyAction, store: any) => {
	if (get(action, 'meta.showLoadingBar')) {
		const apiAction = get(action, 'meta.api');

		if (apiAction === 'start') store.dispatch(uiActions.addPendingLoadingBarApiCall());
		else if (apiAction === 'error' || apiAction === 'success')
			store.dispatch(uiActions.removePendingLoadingBarApiCall());
	}
};

const __getNotificationFromConfigResult = (action: AnyAction, configResult?: ApiConfigNotification): Notification => {
	const notification = getNotificationFromConfigResult(action.payload, configResult);
	if (get(action, ['meta', 'reload'])) {
		notification.reload = true;
		notification.timeout = false;
	}
	return notification;
};

const _getNotification = (action: AnyAction): Notification | null => {
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
	const notification = _getNotification(action);
	if (notification) store.dispatch(notificationActions.addNotification(notification));

	__updateLoadingBar(action, store);

	next(action);
};

export default middleware;
