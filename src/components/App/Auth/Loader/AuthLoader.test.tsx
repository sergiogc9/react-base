import React from 'react';
import { waitFor } from '@testing-library/react';

import { renderWithMockedStore, StateSlice } from 'lib/tests/redux';
import AuthLoader from 'components/App/Auth/Loader';

describe('AuthLoader', () => {
	const renderComponent = (stateSlice: StateSlice = { auth: { isAuthenticated: true } }) =>
		renderWithMockedStore(<AuthLoader />, stateSlice);

	it('should render loading view', async () => {
		const { getByText } = renderComponent();
		await waitFor(() => expect(getByText(/Authenticating/i)).toBeInTheDocument());
	});
});
