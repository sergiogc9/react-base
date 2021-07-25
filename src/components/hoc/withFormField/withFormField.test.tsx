import React from 'react';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import * as Yup from 'yup';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';
import Form from 'components/common/Form';
import withFormField from './withFormField';

const stringValue = 'awesome';
const mockOnFormSubmit = jest.fn();

const CustomInput: React.FC<any> = props => {
	if (props.error) return <div>Error</div>;
	return <input {...props} />;
};
const FormCustomInput = withFormField(CustomInput);

const renderInputComponent = () =>
	TestUtils.renderWithMockedStore(
		<Form<{ test: string }>
			initialValues={{ test: stringValue }}
			validationSchema={Yup.object({
				test: Yup.string().required()
			})}
			onSubmit={mockOnFormSubmit}
		>
			<FormCustomInput name="test" />
			<button type="submit">Submit</button>
		</Form>
	);

const CustomObjectField: React.FC<any> = props => {
	// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
	return <div onClick={() => props.onChange({ awesome: 'yes' })}>{props.value.awesome}</div>;
};
const FormCustomObjectField = withFormField(CustomObjectField);

const renderFakeObjectComponent = () =>
	TestUtils.renderWithMockedStore(
		<Form<{ test: { awesome: string } }>
			initialValues={{ test: { awesome: stringValue } }}
			validationSchema={Yup.object({
				test: Yup.object()
			})}
			onSubmit={mockOnFormSubmit}
		>
			<FormCustomObjectField name="test" />
			<button type="submit">Submit</button>
		</Form>
	);

describe('withFormField hoc', () => {
	afterEach(cleanup);

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render the input', () => {
		renderInputComponent();
		expect(screen.getByDisplayValue(stringValue)).toBeInTheDocument();
	});

	it('should catch onchange event with a string', async () => {
		renderInputComponent();
		userEvent.type(screen.getByDisplayValue(stringValue), 'wow');
		userEvent.click(screen.getByText('Submit'));
		await waitFor(() => expect(mockOnFormSubmit).toHaveBeenCalledTimes(1));
		expect(mockOnFormSubmit).toHaveBeenCalledWith({ test: `${stringValue}wow` }, expect.anything());
	});

	it('should catch onchange event with an object', async () => {
		renderFakeObjectComponent();
		userEvent.click(screen.getByText(stringValue));
		userEvent.click(screen.getByText('Submit'));
		await waitFor(() => expect(mockOnFormSubmit).toHaveBeenCalledTimes(1));
		expect(mockOnFormSubmit).toHaveBeenCalledWith({ test: { awesome: 'yes' } }, expect.anything());
	});

	it('should should show error', async () => {
		renderInputComponent();
		const input = screen.getByDisplayValue(stringValue);
		userEvent.clear(input);
		fireEvent.blur(input);
		await waitFor(() => expect(screen.getByText('Error')).toBeInTheDocument());
	});
});
