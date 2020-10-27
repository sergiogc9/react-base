import { applyMiddleware, Middleware } from 'redux';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import apiMiddleware from './api/redux';
const customMiddleware: Middleware[] = [
	apiMiddleware
];

/* istanbul ignore next */
export const sagaMiddleware = createSagaMiddleware({
	onError: (error: Error, { sagaStack }) => {
		// This is the last resort to catch a saga error, it should never trigger
		console.error('Error at root saga level!!', error.toString(), sagaStack);
		if (window.confirm('An unexpected error ocurred. Do you want to reload the page?')) {
			window.location.reload();
		}
	}
});

export const getMiddleware = () => {
	return applyMiddleware(...getDefaultMiddleware(), ...customMiddleware, sagaMiddleware);
};
