import React from 'react';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Yup from 'yup';
import { TextFieldProps } from '@sergiogc9/react-ui';

import TestUtils from 'lib/tests';
import Form from 'components/common/Form';
import FormTextField from '.';
import { FormTextFieldProps } from './types';

let onSubmitMock = jest.fn();

const getComponent = (
	initialValues = { email: '', date: new Date() },
	type: FormTextFieldProps['type'] = 'email',
	props: Partial<TextFieldProps> = {}
) => {
	return TestUtils.renderWithMockedStore(
		<Form
			onSubmit={onSubmitMock}
			initialValues={initialValues}
			validationSchema={Yup.object({
				email: Yup.string().email('Should be an email').required(),
				date: Yup.date().required()
			})}
		>
			{type === 'date' ? (
				<FormTextField label="Datepicker" name="datepicker" type="date" {...props} />
			) : (
				<FormTextField label="Email" name="email" {...props} />
			)}
			<button type="submit">Submit</button>
		</Form>
	);
};

describe('FormTextField', () => {
	afterEach(cleanup);

	beforeEach(() => {
		onSubmitMock = jest.fn();
		jest.resetAllMocks();
	});

	it('should render inputs', () => {
		const { baseElement } = getComponent();
		expect(baseElement.querySelector('input[name="email"]')).toBeInTheDocument();
	});

	it('should render error if wrong email and touched', async () => {
		const { container, getByText } = getComponent();
		const email = container.querySelector('input[name="email"]')!;
		userEvent.type(email, 'wrong');
		fireEvent.blur(email);
		await waitFor(() => expect(getByText('Should be an email')).toBeInTheDocument());
	});

	it('should not render error if not touched', () => {
		const { queryByText } = getComponent({ email: 'wrong-mail', date: new Date() });
		expect(queryByText('Should be an email')).toBe(null);
	});

	it('should remove value when clicking on the datepicker remove button', async () => {
		const { container } = getComponent({ email: 'fake@email.com', date: new Date(2021, 4, 3) }, 'date', {
			hasRemoveButton: true
		});

		userEvent.click(screen.getByTestId('textfield__remove-button'));

		await waitFor(() => expect(container.querySelector('input[value=""]')).toBeInTheDocument());
	});

	it('should render error if wrong email after submit', async () => {
		const { getByText } = getComponent({ email: 'wrong-email', date: new Date() });
		fireEvent.click(getByText('Submit'));
		await waitFor(() => expect(getByText('Should be an email')).toBeInTheDocument());
	});
});
