import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithStore, StateSlice } from 'lib/tests/redux';
import MainLayout from 'components/layouts/Main/MainLayout';

const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<MainLayout />, stateSlice);

describe('MainLayout', () => {
	it('should render header', () => {
		renderComponent();
		expect(screen.getByTestId('headerProfileAvatar')).toBeInTheDocument();
	});

	it('should render sidebar', () => {
		renderComponent();
		expect(screen.getByTestId('logo-wrapper')).toBeInTheDocument();
	});
});
