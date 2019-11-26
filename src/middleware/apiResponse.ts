import { Middleware } from 'redux';
import get from 'lodash/get';
import has from 'lodash/has';
import keys from 'lodash/keys';

import errorsConfig from '@src/config/apiErrors';
import successConfig from '@src/config/apiSuccess';
import { operators } from '@src/store/app/notifications';
import { Notification } from '@src/types/notification';

const defaultApiErrorNotification: Notification = {
	t: "error.api_server.value",
	level: "danger"
};

const middleware: Middleware = store => next => action => {
	const [actionGroup, actionName] = action.type.split(/\/(?=[^\/]+$)/);

	if (get(action, ['meta', 'api'], '') === "success") {
		const notification = get(successConfig, [actionGroup, actionName]);
		if (notification) store.dispatch(operators.add({ notification }));

	} else if (get(action, ['meta', 'api'], '') === "error") {
		const errorCode = get(action, ['payload', 'error', 'code']) || get(action, ['payload', 'error']);
		if (!errorCode) console.error("Error code not found!");
		let notification: Notification = get(errorsConfig, ["common", errorCode]) || get(errorsConfig, [actionGroup, actionName, errorCode]);
		if (notification && notification.t && typeof notification.t !== "string") {
			const interpolation = notification.t[1];
			const parsedInterpolation: { [key: string]: string } = {};
			for (const key of keys(interpolation)) {
				const interpolationValue = interpolation[key];
				if (has(interpolationValue, 'path')) parsedInterpolation[key] = get(action.payload, get(interpolationValue, 'path'));
				else parsedInterpolation[key] = interpolationValue as string;
			}
			notification.t[1] = parsedInterpolation;
		}
		if (notification && notification.text && has(notification.text, 'path')) {
			notification.text = get(action.payload, get(notification.text, 'path'));
		}
		if (!notification) notification = defaultApiErrorNotification;
		store.dispatch(operators.add({ notification }));
	}

	next(action);
};

export default middleware;
