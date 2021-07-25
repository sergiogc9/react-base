import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Yup from 'yup';

import TestUtils from 'lib/tests';
import Form from 'components/common/Form';
import { FormProps } from './types';

const initialValues = {
	name: ''
};

const validationSchema = Yup.object({
	name: Yup.string().required('Required')
});

const onChangeMock = jest.fn();
const onValidChangeMock = jest.fn();
const onSubmitMock = jest.fn();
const getComponent = (props: Partial<FormProps> = {}) => {
	return TestUtils.renderWithMockedStore(
		<Form
			initialValues={initialValues}
			onSubmit={onSubmitMock}
			onChange={onChangeMock}
			onValidChange={onValidChangeMock}
			validationSchema={validationSchema}
			{...props}
		>
			<Form.TextField name="name" placeholder="name" />
			<Form.ButtonSubmit>Submit</Form.ButtonSubmit>
		</Form>
	);
};

describe('Form', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render form', () => {
		getComponent();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});

	it('should not call on change handlers at mount', () => {
		getComponent();
		expect(onChangeMock).toHaveBeenCalledTimes(0);
		expect(onValidChangeMock).toHaveBeenCalledTimes(0);
	});

	it('should call change and valid handlers', async () => {
		const { container } = getComponent();
		const input = container.querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'nice');
		fireEvent.blur(input);
		await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith({ name: 'nice' }));
		userEvent.clear(input);
		await waitFor(() => expect(expect(onValidChangeMock).toHaveBeenCalledWith(false, { name: 'Required' })));
	});

	it('should call on submit function when form is submitted', async () => {
		const { container } = getComponent();
		const input = container.querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'go@name.com');
		fireEvent.blur(input);
		fireEvent.click(screen.getByText('Submit'));
		await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
	});

	it('should not call handlers function when form is submitted if prop not passed', async () => {
		const { container } = getComponent({ onChange: undefined, onValidChange: undefined, onSubmit: undefined });
		const input = container.querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'go@name.com');
		fireEvent.blur(input);
		fireEvent.click(screen.getByText('Submit'));
		userEvent.clear(input);
		await waitFor(() => expect(onChangeMock).toHaveBeenCalledTimes(0));
		await waitFor(() => expect(onValidChangeMock).toHaveBeenCalledTimes(0));
		await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(0));
	});
});
