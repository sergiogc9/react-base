import React from 'react';

import ErrorBoundary from 'components/common/ErrorBoundary';
import FallbackLoader from 'components/common/FallbackLoader';

import NotificationsProvider from './Notifications/NotificationsProvider';
import Routes from './Routes';
import GlobalStyle from './GlobalStyle';

const App: React.FC = () => {
	return (
		<ErrorBoundary>
			<GlobalStyle />
			<NotificationsProvider>
				<React.Suspense fallback={<FallbackLoader />}>
					<Routes />
				</React.Suspense>
			</NotificationsProvider>
		</ErrorBoundary>
	);
};

export default React.memo(App);
