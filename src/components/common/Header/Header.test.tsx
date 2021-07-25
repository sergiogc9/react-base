import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import { renderWithMockedStore, StateSlice } from 'lib/tests/redux';
import Header from 'components/common/Header';

const mockNavigate = jest.fn();
jest.mock('react-router', () => {
	const currentPackage = jest.requireActual('react-router');
	return {
		...currentPackage,
		useNavigate: () => mockNavigate
	};
});
const renderComponent = (stateSlice: StateSlice = {}) => renderWithMockedStore(<Header />, stateSlice);

describe('Header', () => {
	it('should render header', () => {
		renderComponent();
		expect(screen.getByTestId('header-wrapper')).toBeInTheDocument();
	});

	it('should render bottom border if page is scrolled', () => {
		renderComponent({
			ui: { _: { isPageScrolled: true } }
		});
		expect(screen.getByTestId('header-wrapper')).toHaveClass('with-border');
		expect(screen.getByTestId('header-wrapper')).toHaveStyle('box-shadow: 0px 2px 4px 1px rgba(11,21,25,0.16);');
	});

	it('should hide elements in mobile', () => {
		TestUtils.simulateScreenWidthChange(100);
		const { container } = renderComponent();
		expect(container.querySelector('#headerMenuIcon')).toBeNull();
	});

	it('should show elements in mobile', () => {
		TestUtils.simulateScreenWidthChange(100);
		const { container } = renderComponent();
		expect(container.querySelector('#headerLogo')).not.toBeNull();
	});

	it('should go to home when clicking home button', async () => {
		TestUtils.simulateScreenWidthChange(100);
		const { container } = renderComponent();
		const homeBtn = container.querySelector('#headerLogo')!;
		fireEvent.click(homeBtn);
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});
