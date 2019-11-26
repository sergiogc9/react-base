import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import apiResponseMiddleware from './apiResponse';
const customMiddleware = [
	apiResponseMiddleware
];

export const sagaMiddleware = createSagaMiddleware();

export const getMiddleware = (history: History) => {
	return applyMiddleware(routerMiddleware(history), ...customMiddleware, sagaMiddleware);
};
