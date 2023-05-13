import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useTranslation } from 'react-i18next';
import { merge } from 'lib/imports/lodash';
import theme, { ReactUIProvider } from '@sergiogc9/react-ui-theme';

import { store } from 'store';
import App from 'components/App';
import config from 'config';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000 // 5 minutes
		}
	}
});

const Main: React.FC = () => {
	const { i18n } = useTranslation();

	const finalTheme = merge(theme, {
		keys: { googleMapsAPI: 'EDIT_KEY' },
		locale: i18n.language
	});

	return (
		<Provider store={store}>
			<Router>
				<QueryClientProvider client={queryClient}>
					<ReactUIProvider theme={finalTheme}>
						<>
							<App />
							{config.isDevelopmentEnvironment() && <ReactQueryDevtools />}
						</>
					</ReactUIProvider>
				</QueryClientProvider>
			</Router>
		</Provider>
	);
};

export default React.memo(Main);
