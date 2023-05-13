import React, { PropsWithChildren } from 'react';
import { Toasts } from '@sergiogc9/react-ui';

import NotificationsNotifier from './NotificationsNotifier';

const NotificationsProvider = (props: PropsWithChildren) => {
	const { children } = props;

	return (
		<Toasts>
			<NotificationsNotifier />
			{children}
		</Toasts>
	);
};

export default NotificationsProvider;
