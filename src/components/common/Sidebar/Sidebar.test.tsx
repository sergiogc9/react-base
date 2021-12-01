import React from 'react';
import { screen } from '@testing-library/dom';

import TestUtils from 'lib/tests';
import { renderWithStore, StateSlice } from 'lib/tests/redux';
import Sidebar from 'components/common/Sidebar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
	const currentPackage = jest.requireActual('react-router-dom');
	return {
		...currentPackage,
		useNavigate: () => mockNavigate
	};
});

const renderComponent = (stateSlice: StateSlice = {}, path?: string) =>
	renderWithStore(
		<div>
			<Sidebar />
		</div>,
		stateSlice,
		path
	);

describe('Sidebar', () => {
	it('should show menu and buttons', () => {
		renderComponent();

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Pokemons')).toBeInTheDocument();
	});

	it('should hide elements in mobile', () => {
		TestUtils.simulateScreenWidthChange(100);
		const { container } = renderComponent();

		expect(container.querySelector('#sidebarAddOfferBtn')).toBeNull();
		expect(container.querySelector('.extra-menu')).toBeNull();
	});
});
