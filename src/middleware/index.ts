import { Middleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import apiMiddleware from './api/redux';

/* istanbul ignore next */
const sagaMiddleware = createSagaMiddleware({
	onError: (error: Error, { sagaStack }) => {
		// This is the last resort to catch a saga error, it should never trigger
		// eslint-disable-next-line no-console
		console.error('Error at root saga level!!', error.toString(), sagaStack);
		// eslint-disable-next-line no-alert
		if (window.confirm('An unexpected error ocurred. Do you want to reload the page?')) {
			window.location.reload();
		}
	}
});

const customMiddlewares: Middleware[] = [apiMiddleware, sagaMiddleware];

export { customMiddlewares, sagaMiddleware };
