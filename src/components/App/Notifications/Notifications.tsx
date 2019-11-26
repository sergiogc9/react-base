import React from 'react';
import map from 'lodash/map';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Snackbar from 'react-md/lib/Snackbars/SnackbarContainer';

import { ComponentProps } from './types';
import { QueueNotification } from '@src/types/notification';

import './Notifications.scss';

export default class Notifications extends React.Component<ComponentProps> {

	private toastCache: { [index: number]: any } = {};

	private createToast(notification: QueueNotification) {
		let action;
		if (notification.buttonIcon) action = { children: <FontIcon>{notification.buttonIcon}</FontIcon> };
		else if (notification.buttonText) action = { children: notification.buttonText };
		else if (notification.timeout === false) action = { children: <FontIcon>clear</FontIcon> };
		return {
			...notification,
			action
		};
	}

	private getToasts(notifications: QueueNotification[]) {
		const newToastCache: { [index: number]: any } = {};
		const toasts = map(notifications, notification => {
			const toast = this.toastCache[notification.id] || this.createToast(notification);
			newToastCache[notification.id] = toast;
			return toast;
		});
		this.toastCache = newToastCache;
		return toasts;
	}

	public render() {
		const { onUnqueueNotification, notifications } = this.props;

		const toasts = this.getToasts(notifications);
		if (!toasts.length) return null;

		const toast = toasts[0];

		return <Snackbar
			id="notifications-snackbar"
			className={toast.level}
			toasts={toasts}
			autohide={toast.timeout === false ? false : true}
			autohideTimeout={toast.timeout || 5000}
			onDismiss={() => onUnqueueNotification()}
		/>;
	}
}
