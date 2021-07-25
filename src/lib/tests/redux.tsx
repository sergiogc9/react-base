import React from 'react';
import { createStore } from 'redux';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { merge } from 'lib/imports/lodash';
import theme from '@sergiogc9/react-ui-theme';
import { DefaultPayloadError } from '@sergiogc9/react-utils';

import { INITIAL_STATE, reducers } from 'store';
import { State } from 'store/types';
import { RecursivePartial } from 'types/generics';
import NotificationsProvider from 'components/App/Notifications/NotificationsProvider';

import { getUserProfile } from './entities';

export type StateSlice = RecursivePartial<State>;

export const getFullState = (slice: StateSlice = {}): State => merge({}, INITIAL_STATE, slice);

const mockStore = configureMockStore<State>();

export const getStore = (stateSlice: StateSlice = {}) => createStore(reducers, getFullState(stateSlice));
export const getMockedStore = (stateSlice: StateSlice = {}) => mockStore(getFullState(stateSlice));
export const getApiError = (): DefaultPayloadError => ({
	code: 'FAKE_ERROR_CODE',
	message: 'A fake error ocurred'
});

// Minimum basic state to make most of the components usable (auth, profile, etc).
const basicState: StateSlice = { auth: { profile: getUserProfile() } };

const __getWrapperWithoutStore = (children: React.ReactNode, urlPath?: string) => {
	const queryClient = new QueryClient();
	const initialEntries = urlPath ? [urlPath] : ['/'];
	return (
		<MemoryRouter initialEntries={initialEntries}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<NotificationsProvider>{children}</NotificationsProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</MemoryRouter>
	);
};

export const renderWithStore = (component: JSX.Element, stateSlice: StateSlice = {}, urlPath?: string) => {
	const store = getStore(merge(basicState, stateSlice));
	const Wrapper: React.FC = ({ children }) => (
		<Provider store={store}>{__getWrapperWithoutStore(children, urlPath)}</Provider>
	);
	return { ...render(component, { wrapper: Wrapper }), store };
};

export const renderWithMockedStore = (component: JSX.Element, stateSlice: StateSlice = {}, urlPath?: string) => {
	const store = getMockedStore(merge(basicState, stateSlice));
	const Wrapper: React.FC = ({ children }) => (
		<Provider store={store}>{__getWrapperWithoutStore(children, urlPath)}</Provider>
	);
	return { ...render(component, { wrapper: Wrapper }), store };
};

export const getWrapperWithStore = (stateSlice: StateSlice = {}, urlPath?: string) => {
	const store = getStore(merge(basicState, stateSlice));
	const Wrapper: React.FC = ({ children }) => (
		<Provider store={store}>{__getWrapperWithoutStore(children, urlPath)}</Provider>
	);
	return Wrapper;
};

export const getWrapperWithMockedStore = (stateSlice: StateSlice = {}, urlPath?: string) => {
	const store = getMockedStore(merge(basicState, stateSlice));
	const Wrapper: React.FC = ({ children }) => (
		<Provider store={store}>{__getWrapperWithoutStore(children, urlPath)}</Provider>
	);
	return Wrapper;
};
