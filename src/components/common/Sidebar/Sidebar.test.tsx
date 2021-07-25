import React from 'react';
import userEvent from '@testing-library/user-event';

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

describe('Sidebar', () => {
	const renderComponent = (stateSlice: StateSlice = {}) =>
		renderWithStore(
			<div>
				<Sidebar />
			</div>,
			stateSlice
		);

	it('should show menu and buttons', () => {
		const { container } = renderComponent();

		expect(container.querySelector('a[href="/"]')).toBeInTheDocument();
		expect(container.querySelector('a[href="/pokemon"]')).toBeInTheDocument();
	});

	it('should hide elements in mobile', () => {
		TestUtils.simulateScreenWidthChange(100);
		const { container } = renderComponent();

		expect(container.querySelector('#sidebarAddOfferBtn')).toBeNull();
		expect(container.querySelector('.extra-menu')).toBeNull();
	});

	it('should go to home when clicking the logo', () => {
		TestUtils.simulateScreenWidthChange(2000);
		const { container } = renderComponent();
		userEvent.click(container.querySelector('#sidebarSquareLogo')!);

		expect(mockNavigate).toHaveBeenCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});
