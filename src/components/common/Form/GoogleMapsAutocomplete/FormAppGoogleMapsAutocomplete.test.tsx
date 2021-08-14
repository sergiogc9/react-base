import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Yup from 'yup';

import TestUtils from 'lib/tests';
import { GoogleMapsPlace } from 'types/google';
import Form from 'components/common/Form';

import FormMapsAutocomplete from '.';
import { FormAppGoogleMapsAutocompleteProps } from './types';

const onSubmitMock = jest.fn();
const mockOnGetPlacePredictions = jest.fn();
const mockOnGeoCode = jest.fn();

jest.useFakeTimers('modern');

const getComponent = (
	initialValues?: { location: GoogleMapsPlace },
	props: Partial<FormAppGoogleMapsAutocompleteProps> = {}
) => {
	const defaultLocation: GoogleMapsPlace = { placeId: 'fake-id', longitude: 10, latitude: 20, name: 'Awesome place' };

	return TestUtils.renderWithMockedStore(
		<Form
			onSubmit={onSubmitMock}
			initialValues={initialValues ?? { location: defaultLocation }}
			validationSchema={Yup.object({
				location: Yup.object<GoogleMapsPlace>().required('Should be an object')
			})}
		>
			<FormMapsAutocomplete label="Location" name="location" {...props} />
			<button type="submit">Submit</button>
		</Form>
	);
};

describe('FormAppGoogleMapsAutocomplete', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		TestUtils.mockGoogleMapsAPI(mockOnGetPlacePredictions, mockOnGeoCode);
	});

	it('should render input', () => {
		getComponent();

		expect(screen.getByDisplayValue('Awesome place')).toBeInTheDocument();
	});

	// eslint-disable-next-line jest/no-disabled-tests
	it.skip('should update value in form', async () => {
		getComponent();

		const input = screen.getByTestId('select-field').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Girona');

		jest.runAllTimers();

		await waitFor(() => expect(screen.getByText(', Montilivi')).toBeInTheDocument());
		userEvent.click(screen.getByText(', Montilivi'));

		expect(screen.getByText('Submit')).toBeEnabled();
		userEvent.click(screen.getByText('Submit'));

		await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());
		expect(onSubmitMock).toHaveBeenCalledWith(
			{
				location: {
					latitude: 10,
					longitude: 20,
					name: 'Girona, Montilivi',
					placeId: '123456'
				}
			},
			expect.anything()
		);
	});
});
