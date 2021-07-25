import React from 'react';
import { waitFor } from '@testing-library/react';

import TestUtils from 'lib/tests';
import Routes from 'components/App/Routes';

const renderComponent = (route: string) =>
	TestUtils.renderWithMockedStore(
		<Routes />,
		{ auth: { isAuthenticated: true, profile: TestUtils.getUserProfile() } },
		route
	);

describe('routes config', () => {
	it('should render home', async () => {
		const { container } = renderComponent('/');
		await waitFor(() => expect(container.querySelector('#mainPage')).toBeInTheDocument());
	});

	it('should render pokemon list page', async () => {
		const { container } = renderComponent('/pokemon');
		await waitFor(() => expect(container.querySelector('#pokemonListPage')).toBeInTheDocument());
	});

	it('should render pokemon item page', async () => {
		const { container } = renderComponent('/pokemon/1');
		await waitFor(() => expect(container.querySelector('#pokemonItemPage')).toBeInTheDocument());
	});
});
