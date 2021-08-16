import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import * as Yup from 'yup';

import TestUtils from 'lib/tests';
import Form from 'components/common/Form';

import FormButtonCancel from '.';

const defaultValues = { email: 'test@eurofirms.com' };

const mockOnClick = jest.fn();

const renderComponent = () => {
	return TestUtils.renderWithMockedStore(
		<Form
			defaultValues={defaultValues}
			validationSchema={Yup.object({
				email: Yup.string().email('Should be an email').required()
			})}
		>
			<Form.TextField label="Email" name="email" />
			<FormButtonCancel onClick={mockOnClick}>Cancel</FormButtonCancel>
		</Form>
	);
};

describe('FormButtonCancel', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should handle click', () => {
		renderComponent();

		fireEvent.click(screen.getByText('Cancel'));

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});
