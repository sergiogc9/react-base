import React from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithStore, StateSlice } from 'lib/tests/redux';
import { actions } from 'store/notifications';
import Notifications from 'components/App/Notifications/NotificationsProvider';

const reloadPageMock = jest.fn();
describe('Notifications', () => {
	const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<Notifications />, stateSlice);

	beforeEach(() => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: { reload: reloadPageMock }
		});
	});

	it('should render a notification with text', async () => {
		const { getByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ text: 'Fake notification' }));
		await waitFor(() => expect(getByText('Fake notification')).toBeInTheDocument());
	});

	it('should render a notification using a simple i18n key', async () => {
		const { getByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ t: 'fake-key' }));
		await waitFor(() => expect(getByText('fake-key')).toBeInTheDocument());
	});

	it('should render a notification using a interpolated i18n key', async () => {
		const { getByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ t: ['fake-key', { message: 'Message' }] }));
		await waitFor(() => expect(getByText('fake-key')).toBeInTheDocument());
	});

	it('should render a reload button', async () => {
		const { getByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ text: 'Fake notification', reload: true }));
		await waitFor(() => expect(getByText('Reload')).toBeInTheDocument());
	});

	it('should reload page if reload button is clicked', async () => {
		const { getByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ text: 'Fake notification', reload: true }));
		await waitFor(() => expect(getByText('Reload')).toBeInTheDocument());
		userEvent.click(getByText('Reload'));
		expect(reloadPageMock).toHaveBeenCalledTimes(1);
	});

	it('should render a close button if timeout is disabled', async () => {
		const { getByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ text: 'Fake notification', timeout: false }));
		await waitFor(() => expect(getByText('Close')).toBeInTheDocument());
	});

	it('should close notification when close button is clicked', async () => {
		const { getByText, queryByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ text: 'Fake notification', timeout: false }));
		await waitFor(() => expect(getByText('Close')).toBeInTheDocument());
		userEvent.click(getByText('Close'));
		await waitFor(() => expect(queryByText('Close')).toBe(null));
	});

	it('should not render multiple times a notification when more than one is added', async () => {
		const { getAllByText, store } = renderComponent();
		store.dispatch(actions.addNotification({ text: 'Fake notification', timeout: false }));
		store.dispatch(actions.addNotification({ text: 'Fake notification 2', timeout: false }));
		await waitFor(() => expect(getAllByText(/Fake notification/).length).toBe(2));
	});
});
