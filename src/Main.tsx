import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { I18nextProvider } from 'react-i18next';

import i18n from '@src/lib/i18n';
import { history, store } from './store';
import App from './components/App';

import './Main.scss';

export default function Main() {
	return (
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				<ConnectedRouter history={history}>
					<App />
				</ConnectedRouter>
			</I18nextProvider>
		</Provider>
	);
}
