import React from 'react';

import NotificationsProvider from './Notifications/NotificationsProvider';
import PublicRoutes from './Routes/PublicRoutes';
import PrivateRoutes from './Routes/PrivateRoutes';
import GlobalStyle from './GlobalStyle';

// TODO remove css file!
import './App.css';

const App: React.FC = () => {

	const authenticated = true; // TODO: get correct value

	return (
		<div id="app" className="App">
			<GlobalStyle />
			<NotificationsProvider>
				{authenticated && <PrivateRoutes />}
				<PublicRoutes />
			</NotificationsProvider>
		</div>
	);
};

export default React.memo(App);
