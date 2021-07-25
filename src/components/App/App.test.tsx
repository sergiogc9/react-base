import React from 'react';
import { find } from 'lib/imports/lodash';

import { renderWithMockedStore, StateSlice } from 'lib/tests/redux';
import { actions as authActions } from 'store/auth';
import App from 'components/App';

const renderComponent = (stateSlice: StateSlice = {}) => renderWithMockedStore(<App />, stateSlice);

describe('App', () => {
	it('should render authenticating page in private route if not authenticated', () => {
		const { getByText, store } = renderComponent();
		expect(getByText(/Authenticating/i)).toBeInTheDocument();
		expect(find(store.getActions(), { type: authActions.fetchAuth.type })).toBeTruthy();
	});

	it('should render main private page if authenticated', () => {
		const { getByTestId } = renderComponent({
			auth: { isAuthenticated: true, profile: {} }
		});
		expect(getByTestId('logo-wrapper')).toBeInTheDocument();
	});
});
