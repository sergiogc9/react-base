import React from 'react';
import { Toasts } from '@sergiogc9/react-ui';

import NotificationsNotifier from './NotificationsNotifier';

const NotificationsProvider: React.FC = props => {
	const { children } = props;

	return (
		<Toasts>
			<NotificationsNotifier />
			{children}
		</Toasts>
	);
};

export default NotificationsProvider;
