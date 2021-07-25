import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { merge } from 'lib/imports/lodash';
import theme from '@sergiogc9/react-ui-theme';

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

	const finalTheme = merge(theme, { locale: i18n.language });

	return (
		<Provider store={store}>
			<Router>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={finalTheme}>
						<>
							<App />
							{config.isDevelopmentEnvironment() && <ReactQueryDevtools />}
						</>
					</ThemeProvider>
				</QueryClientProvider>
			</Router>
		</Provider>
	);
};

export default React.memo(Main);
