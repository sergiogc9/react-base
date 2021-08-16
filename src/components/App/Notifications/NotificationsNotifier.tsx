import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { forEach, isArray } from 'lib/imports/lodash';
import { Button, useToasts } from '@sergiogc9/react-ui';

import { actions } from 'store/notifications';
import selectors from 'store/notifications/selectors';

const notificationsQueued: Record<string, true> = {};

const NotificationsNotifier: React.FC = () => {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const notifications = useSelector(selectors.getNotifications);
	const { addToast } = useToasts();

	const __reloadPage = React.useCallback(() => window.location.reload(), []);

	React.useEffect(() => {
		forEach(notifications, (notification, key) => {
			// Do nothing if already queued
			if (notificationsQueued[key]) return;

			const actionContent = notification.reload ? (
				<Button aspectSize="s" bg="transparent" color="currentColor" onClick={__reloadPage} variant="subtle">
					Reload
				</Button>
			) : null;

			let text = '';
			if (notification.text) text = notification.text;
			// If using i18n interpolation
			else if (notification.t && isArray(notification.t)) text = t(notification.t[0], notification.t[1]);
			// If using only i18n key
			else text = t(notification.t!);

			// Queue notification
			addToast({
				actionContent,
				duration: notification.timeout !== false ? notification.timeout : 'always',
				key,
				hasCloseBtn: notification.timeout === false,
				message: text,
				status: notification.level || 'info',
				onClose: () => {
					// remove this snackbar from redux store
					dispatch(actions.removeNotification(key));
					delete notificationsQueued[key];
				}
			});

			// Set as queued
			notificationsQueued[key] = true;
		});
	}, [__reloadPage, addToast, dispatch, notifications, t]);

	return null;
};

export default NotificationsNotifier;
