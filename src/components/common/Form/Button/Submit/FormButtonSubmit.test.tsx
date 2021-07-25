import React from 'react';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Yup from 'yup';

import TestUtils from 'lib/tests';
import Form from 'components/common/Form';
import FormButtonSubmit from 'components/common/Form/Button/Submit';
import { FormButtonSubmitProps } from './types';

const initialValues = { email: 'test@google.es' };

const onSubmitMock = jest.fn();

const renderComponent = (props: Partial<FormButtonSubmitProps> = { isDefaultEnabled: false }) => {
	const { isDefaultEnabled } = props;
	return TestUtils.renderWithMockedStore(
		<Form
			onSubmit={onSubmitMock}
			initialValues={initialValues}
			validationSchema={Yup.object({
				email: Yup.string().email('Should be an email').required()
			})}
		>
			<Form.TextField label="Email" name="email" />
			<FormButtonSubmit isDefaultEnabled={isDefaultEnabled}>Submit</FormButtonSubmit>
		</Form>
	);
};

describe('FormButtonSubmit', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be disabled at mount time', () => {
		renderComponent();

		fireEvent.click(screen.getByText('Submit'));
		expect(screen.queryAllByText('button[disabled]')).toBeTruthy();

		expect(onSubmitMock).toHaveBeenCalledTimes(0);
	});

	it('should be enabled at mount time when the isDefaultSelect prop is true', () => {
		renderComponent({ isDefaultEnabled: true });

		expect(screen.getByText('Submit')).toBeEnabled();
	});

	it('should be enabled after touching an input', async () => {
		renderComponent();

		const email = screen.getByText('Email');
		fireEvent.click(email);

		expect(screen.getByText('Submit')).toBeEnabled();
	});

	it('should be disabled if some input is wrong', async () => {
		renderComponent();

		const email = screen.getByText('Email');
		userEvent.type(email, 'wrong');
		fireEvent.blur(email);
		fireEvent.click(screen.getByText('Submit'));

		await waitFor(() => expect(screen.queryAllByText('button[disabled]')).toBeTruthy());
		expect(onSubmitMock).toHaveBeenCalledTimes(0);
	});
});
