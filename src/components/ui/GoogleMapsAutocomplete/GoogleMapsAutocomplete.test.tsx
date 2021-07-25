import React from 'react';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { actions as notificationActions } from 'store/notifications';
import TestUtils from 'lib/tests';
import { GoogleMapsPlace } from 'types/google';

import GoogleMapsAutocomplete from './GoogleMapsAutocomplete';
import { GoogleMapsAutocompleteProps } from './types';

const googleMapsAutocompleteTestId = 'GoogleMapsAutocomplete';

const place: GoogleMapsPlace = { placeId: 'fake-id', longitude: 10, latitude: 20, name: 'Awesome place' };
const mockOnGetPlacePredictions = jest.fn();
const mockOnGeoCode = jest.fn();
const mockOnPlaceChange = jest.fn();
const renderComponent = (props: Partial<GoogleMapsAutocompleteProps> = {}) => {
	return TestUtils.renderWithMockedStore(
		<GoogleMapsAutocomplete
			data-testid={googleMapsAutocompleteTestId}
			defaultPlace={place}
			onPlaceChange={mockOnPlaceChange}
			{...props}
		/>
	);
};

jest.useFakeTimers('modern');

describe('GoogleMapsAutocomplete component', () => {
	afterEach(cleanup);

	beforeEach(() => {
		jest.clearAllMocks();
		TestUtils.mockGoogleMapsAPI(mockOnGetPlacePredictions, mockOnGeoCode);
	});

	it('should render default value', () => {
		renderComponent();

		expect(screen.getByDisplayValue(place.name)).toBeInTheDocument();
	});

	it('should not show "no results" text when clearing input', async () => {
		renderComponent();

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);

		jest.runAllTimers();

		expect(screen.queryByText('No results')).toBeNull();
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should fetch options from google maps and show the results', async () => {
		renderComponent();

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() => expect(screen.getByText('Girona')).toBeInTheDocument());
		expect(mockOnGetPlacePredictions).toHaveBeenCalledWith({ input: 'Girona' });
	});

	it('should fetch options only with regions', async () => {
		renderComponent({ onlyRegions: true });

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() =>
			expect(mockOnGetPlacePredictions).toHaveBeenCalledWith({ input: 'Girona', types: ['(regions)'] })
		);
	});

	it('should fetch options only with countries', async () => {
		renderComponent({ countries: ['es', 'pt'] });

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() =>
			expect(mockOnGetPlacePredictions).toHaveBeenCalledWith({
				input: 'Girona',
				componentRestrictions: { country: ['es', 'pt'] }
			})
		);
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should fetch options from google maps and show the results more than once', async () => {
		mockOnGetPlacePredictions.mockResolvedValue({ predictions: [{ description: 'Girona, Montilivi' }] });
		renderComponent();

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() => expect(mockOnGetPlacePredictions).toHaveBeenCalledWith({ input: 'Girona' }));
		await waitFor(() => expect(screen.getByText(', Montilivi')).toBeInTheDocument());

		mockOnGetPlacePredictions.mockResolvedValue({ predictions: [{ description: 'Girona, Montjuic' }] });

		userEvent.clear(input);
		userEvent.type(input, 'Montjuic');

		jest.runAllTimers();

		await waitFor(() => expect(mockOnGetPlacePredictions).toHaveBeenCalledWith({ input: 'Montjuic' }));
	}, 20000);

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should call onPlaceChange with fetched data', async () => {
		renderComponent({ defaultPlace: undefined });

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() => expect(screen.getByText(', Montilivi')).toBeInTheDocument());
		userEvent.click(screen.getByText(', Montilivi'));

		await waitFor(() =>
			expect(mockOnPlaceChange).toHaveBeenCalledWith({
				latitude: 10,
				longitude: 20,
				name: 'Girona, Montilivi',
				placeId: '123456'
			})
		);
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should call onPlaceChange with null if input is cleared', async () => {
		renderComponent({ hasRemoveButton: true });

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() => expect(screen.getByText(', Montilivi')).toBeInTheDocument());
		userEvent.click(screen.getByText(', Montilivi'));

		userEvent.click(screen.getByTestId('textfield__remove-button'));

		await waitFor(() => expect(mockOnPlaceChange).toHaveBeenCalledWith(null));
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should not call onPlaceChange if not passed', async () => {
		renderComponent({ onPlaceChange: undefined });

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() => expect(screen.getByText(', Montilivi')).toBeInTheDocument());
		userEvent.click(screen.getByText(', Montilivi'));

		expect(mockOnPlaceChange).toHaveBeenCalledTimes(0);
	});

	it('should call onBlur when blurred', async () => {
		const mockOnBlur = jest.fn();
		renderComponent({ onBlur: mockOnBlur });

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		userEvent.click(document.body);
		jest.runAllTimers();

		expect(mockOnBlur).toHaveBeenCalled();
	});

	it('should set options equal to selected one after blurred', async () => {
		renderComponent();

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		userEvent.click(document.body);

		jest.runAllTimers();
		userEvent.click(input);

		await waitFor(() => expect(screen.getByText('Awesome place')).toBeInTheDocument());
	});

	it('should set options equal to empty after blurred if no default value', () => {
		renderComponent({ defaultPlace: undefined });

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		userEvent.click(document.body);

		jest.runAllTimers();
		userEvent.click(input);

		expect(screen.queryByRole('option')).not.toBeInTheDocument();
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should dispatch error notification if prediction google api fails', async () => {
		mockOnGetPlacePredictions.mockRejectedValueOnce({});
		const { store } = renderComponent();

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() =>
			expect(store.getActions().filter(item => item.type === notificationActions.addNotification.type).length).toBe(1)
		);
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should dispatch error notification if geocoder google api fails', async () => {
		mockOnGeoCode.mockRejectedValueOnce({});
		const { store } = renderComponent();

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() => expect(screen.getByText(', Montilivi')).toBeInTheDocument(), { timeout: 20000 });
		userEvent.click(screen.getByText(', Montilivi'));

		await waitFor(() =>
			expect(store.getActions().filter(item => item.type === notificationActions.addNotification.type).length).toBe(1)
		);
	});
});
