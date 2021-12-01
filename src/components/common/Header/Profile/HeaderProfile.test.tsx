import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';
import { StateSlice } from 'lib/tests/redux';

import HeaderProfile from '.';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
	const currentPackage = jest.requireActual('react-router-dom');
	return {
		...currentPackage,
		useNavigate: () => mockNavigate
	};
});
const mockLogout = jest.fn();
jest.mock('lib/auth', () => {
	return {
		doLogout: () => mockLogout()
	};
});

const renderComponent = (stateSlice: StateSlice = { auth: { profile: {} } }) =>
	TestUtils.renderWithStore(<HeaderProfile />, stateSlice);

describe('HeaderProfile', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render avatar', () => {
		renderComponent();
		expect(screen.getByTestId('headerProfileAvatar')).toBeInTheDocument();
	});

	it('should show dropdown menu by clicking', async () => {
		renderComponent();
		userEvent.click(screen.getByTestId('headerProfileAvatar'));
		await waitFor(() => expect(screen.getByTestId('headerProfileUserDropdownMenu')).toBeVisible());
	});

	it('should hide dropdown menu by clicking outside', async () => {
		renderComponent();
		userEvent.click(screen.getByTestId('headerProfileAvatar'));
		await waitFor(() => expect(screen.getByTestId('headerProfileUserDropdownMenu')).toBeVisible());
		userEvent.click(document.body);
		await waitFor(() => expect(screen.getByTestId('headerProfileUserDropdownMenu')).not.toBeVisible());
	});

	it('should navigate to profile page', async () => {
		renderComponent();
		userEvent.click(screen.getByTestId('headerProfileAvatar'));
		await waitFor(() => expect(screen.getByTestId('headerProfileUserDropdownMenu')).toBeVisible());
		userEvent.click(screen.getByText('User settings'));
		expect(mockNavigate).toHaveBeenCalledWith('/profile');
	});

	it('should navigate to notifications page', async () => {
		renderComponent();
		userEvent.click(screen.getByTestId('headerProfileAvatar'));
		await waitFor(() => expect(screen.getByTestId('headerProfileUserDropdownMenu')).toBeVisible());
		userEvent.click(screen.getByText('Notifications'));
		expect(mockNavigate).toHaveBeenCalledWith('/notifications');
	});
});
