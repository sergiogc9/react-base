import React from 'react';

import FallbackLoader from 'components/common/FallbackLoader';

import NotificationsProvider from './Notifications/NotificationsProvider';
import Routes from './Routes';
import GlobalStyle from './GlobalStyle';

const App: React.FC = () => {
	return (
		<>
			<GlobalStyle />
			<NotificationsProvider>
				<React.Suspense fallback={<FallbackLoader />}>
					<Routes />
				</React.Suspense>
			</NotificationsProvider>
		</>
	);
};

export default React.memo(App);
