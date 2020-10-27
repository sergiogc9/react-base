import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createStore } from 'redux';
import configureMockStore from "redux-mock-store";
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { ReactQueryCacheProvider, QueryCache } from "react-query";
import { BrowserRouter as Router } from 'react-router-dom';
import { merge } from 'lib/imports/lodash';

import { INITIAL_STATE, reducers } from 'store';
import { State } from 'store/types';
import { DefaultPayloadError } from 'lib/store/reducer';
import { RecursivePartial } from 'types/generics';
import NotificationsProvider from 'components/App/Notifications/NotificationsProvider';
import ThemeProvider from 'ui/components/ThemeProvider';

i18n.use(initReactI18next).init({
	lng: 'en', resources: {}
});

export type StateSlice = RecursivePartial<State>;

export const getFullState = (slice: StateSlice = {}): State => merge({}, INITIAL_STATE, slice);

const mockStore = configureMockStore<State>();

export const getStore = (stateSlice: StateSlice = {}) => createStore(reducers, getFullState(stateSlice));
export const getMockedStore = (stateSlice: StateSlice = {}) => mockStore(getFullState(stateSlice));
export const getApiError = (): DefaultPayloadError => ({ code: 'FAKE_ERROR_CODE', message: 'A fake error ocurred' });

export const renderWithStore = (component: JSX.Element, stateSlice: StateSlice = {}) => {
	const store = getStore(stateSlice);
	const Wrapper: React.FC = ({ children }) => (
		<Provider store={store} >
			{__getWrapperWithoutStore(children)}
		</Provider>
	);
	return { ...render(component, { wrapper: Wrapper }), store };
};

export const renderWithMockedStore = (component: JSX.Element, stateSlice: StateSlice = {}) => {
	const store = getMockedStore(stateSlice);
	const Wrapper: React.FC = ({ children }) => (
		<Provider store={store} >
			{__getWrapperWithoutStore(children)}
		</Provider>
	);
	return { ...render(component, { wrapper: Wrapper }), store };
};

const __getWrapperWithoutStore = (children: React.ReactNode) => {
	const queryCache = new QueryCache();
	return (
		<Router>
			<ReactQueryCacheProvider queryCache={queryCache}>
				<ThemeProvider>
					<NotificationsProvider>
						{children}
					</NotificationsProvider>
				</ThemeProvider>
			</ReactQueryCacheProvider>
		</Router>
	);
};
