import React from 'react';
import { createRoot } from 'react-dom/client';

import Main from './Main';
import * as serviceWorker from './serviceWorker';
import 'i18n';

const root = createRoot(document.getElementById('root')!);
root.render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
