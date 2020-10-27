import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { forEach, isArray } from 'lib/imports/lodash';

import { actions } from 'store/notifications';
import selectors from 'store/notifications/selectors';

const notificationsQueued: Record<string, true> = {};

const NotificationsNotifier: React.FC = () => {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const notifications = useSelector(selectors.getNotifications);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const __reloadPage = React.useCallback(() => window.location.reload(), []);

	React.useEffect(() => {
		forEach(notifications, (notification, key) => {
			// Do nothing if already queued
			if (notificationsQueued[key]) return;

			let action;
			if (notification.reload) action = () => <button onClick={__reloadPage}>Reload</button>;
			else if (notification.timeout === false) action = (key: string) => <button onClick={() => { closeSnackbar(key); }}>Close</button>;

			let text: string = "";
			if (notification.text) text = notification.text;
			// If using i18n interpolation
			else if (notification.t && isArray(notification.t)) text = t(notification.t[0], notification.t[1]);
			// If using only i18n key
			else text = t(notification.t!);

			const options = {
				text,
				persist: notification.timeout === false,
				autoHideDuration: notification.timeout || 5000,
				variant: notification.level || 'info',
				action
			};

			// Queue notification
			enqueueSnackbar(options.text, {
				key,
				...options,
				onExited: (event, myKey) => {
					// remove this snackbar from redux store
					dispatch(actions.removeNotification(myKey.toString()));
					delete notificationsQueued[key];
				}
			});

			// Set as queued
			notificationsQueued[key] = true;
		});
	}, [t, notifications, closeSnackbar, enqueueSnackbar, dispatch, __reloadPage]);

	return null;
};

export default NotificationsNotifier;
