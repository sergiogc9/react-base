import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoogleMapsAutocompleteProps } from '@sergiogc9/react-ui';

import { actions as notificationActions } from 'store/notifications';
import TestUtils from 'lib/tests';

import AppGoogleMapsAutocomplete from './AppGoogleMapsAutocomplete';

jest.mock('@sergiogc9/react-ui', () => {
	const currentPackage = jest.requireActual('@sergiogc9/react-ui');
	return {
		...currentPackage,
		GoogleMapsAutocomplete: ({ onApiError }: GoogleMapsAutocompleteProps) => {
			return (
				<button onClick={onApiError} type="button">
					Simulate api fail
				</button>
			);
		}
	};
});

const mockOnApiError = jest.fn();
const renderComponent = (props: Partial<GoogleMapsAutocompleteProps> = {}) => {
	return TestUtils.renderWithMockedStore(<AppGoogleMapsAutocomplete onApiError={mockOnApiError} {...props} />);
};

describe('AppGoogleMapsAutocomplete component', () => {
	afterEach(cleanup);

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should dispatch error notification if google api fails', () => {
		const { store } = renderComponent();

		userEvent.click(screen.getByText('Simulate api fail'));

		expect(store.getActions().filter(item => item.type === notificationActions.addNotification.type).length).toBe(1);
	});

	it('should call onApiError prop', () => {
		renderComponent();

		userEvent.click(screen.getByText('Simulate api fail'));

		expect(mockOnApiError).toHaveBeenCalled();
	});

	it('should not call onApiError prop if not provided', () => {
		renderComponent({ onApiError: undefined });

		userEvent.click(screen.getByText('Simulate api fail'));

		expect(mockOnApiError).not.toHaveBeenCalled();
	});
});
