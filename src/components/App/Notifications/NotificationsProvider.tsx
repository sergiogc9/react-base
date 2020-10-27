import React from 'react';
import { SnackbarProvider } from 'notistack';

import NotificationsNotifier from './NotificationsNotifier';

const NotificationsProvider: React.FC = props => {
	const { children } = props;

	return (
		<SnackbarProvider>
			<NotificationsNotifier />
			{children}
		</SnackbarProvider>
	);
};

export default NotificationsProvider;
