import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ReactQueryCacheProvider, QueryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

import { store } from 'store';
import ThemeProvider from 'ui/components/ThemeProvider';
import App from 'components/App';
import config from 'config';

const queryCache = new QueryCache();

const Main: React.FC = () => {

	return (
		<Provider store={store}>
			<Router>
				<ReactQueryCacheProvider queryCache={queryCache}>
					<ThemeProvider>
						<>
							<App />
							{config.isDevelopmentEnvironment() && <ReactQueryDevtools />}
						</>
					</ThemeProvider>
				</ReactQueryCacheProvider>
			</Router>
		</Provider>
	);
};


export default React.memo(Main);
