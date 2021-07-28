import React from 'react';
import { useSelector } from 'react-redux';

import ErrorBoundary from 'components/common/ErrorBoundary';
import FallbackLoader from 'components/common/FallbackLoader';
import LoadingBar from 'components/ui/LoadingBar';

import uiSelectors from 'store/ui/selectors';
import NotificationsProvider from './Notifications/NotificationsProvider';
import Routes from './Routes';
import GlobalStyle from './GlobalStyle';

const App: React.FC = () => {
	const loadingBarApiCalls = useSelector(uiSelectors.getPendingLoadingBarApiCalls);

	return (
		<ErrorBoundary>
			<GlobalStyle />
			<NotificationsProvider>
				<LoadingBar isVisible={loadingBarApiCalls > 0} />
				<React.Suspense fallback={<FallbackLoader />}>
					<Routes />
				</React.Suspense>
			</NotificationsProvider>
		</ErrorBoundary>
	);
};

export default React.memo(App);
