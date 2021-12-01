import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithStore, StateSlice } from 'lib/tests/redux';
import { actions } from 'store/notifications';
import Notifications from 'components/App/Notifications/NotificationsProvider';

const reloadPageMock = jest.fn();
const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<Notifications />, stateSlice);

describe('Notifications', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: { reload: reloadPageMock }
		});
	});

	it('should render a notification with text', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ text: 'Fake notification' }));

		await waitFor(() => expect(screen.getByText('Fake notification')).toBeInTheDocument());
	});

	it('should render a notification using a simple i18n key', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ t: 'fake-key' }));

		await waitFor(() => expect(screen.getByText('fake-key')).toBeInTheDocument());
	});

	it('should render a notification using a interpolated i18n key', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ t: ['fake-key', { message: 'Message' }] }));

		await waitFor(() => expect(screen.getByText('fake-key')).toBeInTheDocument());
	});

	it('should render a reload button', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ text: 'Fake notification', reload: true }));

		await waitFor(() => expect(screen.getByText('Reload')).toBeInTheDocument());
	});

	it('should reload page if reload button is clicked', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ text: 'Fake notification', reload: true }));

		await waitFor(() => expect(screen.getByText('Reload')).toBeInTheDocument());

		userEvent.click(screen.getByText('Reload'));

		expect(reloadPageMock).toHaveBeenCalledTimes(1);
	});

	it('should render a close button if timeout is disabled', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ text: 'Fake notification', timeout: false }));

		await waitFor(() => expect(screen.getByTestId('toast').querySelector('button')).toBeInTheDocument());
	});

	it('should close notification when close button is clicked', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ text: 'Fake notification', timeout: false }));

		await waitFor(() => expect(screen.getByTestId('toast').querySelector('button')).toBeInTheDocument());

		userEvent.click(screen.getByTestId('toast').querySelector('button')!);

		await waitFor(() => expect(screen.queryByTestId('toast')).toBe(null));
	});

	it('should not render multiple times a notification when more than one is added', async () => {
		const { store } = renderComponent();

		store.dispatch(actions.addNotification({ text: 'Fake notification', timeout: false }));

		store.dispatch(actions.addNotification({ text: 'Fake notification 2', timeout: false }));

		await waitFor(() => expect(screen.getAllByText(/Fake notification/).length).toBe(2));
	});
});
