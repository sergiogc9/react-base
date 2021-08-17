import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Yup from 'yup';
import { Select, SelectProps } from '@sergiogc9/react-ui';

import TestUtils from 'lib/tests';
import Form from 'components/common/Form';
import FormSelect from 'components/common/Form/Select';

const mockOnSubmit = jest.fn();
const mockOnBlur = jest.fn();

type FormValues = {
	language: 'en' | 'es';
};

const getComponent = (
	defaultValues: Partial<FormValues> = { language: 'en' },
	validationSchema: any = Yup.object({
		language: Yup.string().oneOf(['en', 'es'], 'Incorrect language').required()
	}),
	selectProps: Partial<SelectProps> = {}
) => {
	return TestUtils.renderWithMockedStore(
		<Form onSubmit={mockOnSubmit} defaultValues={defaultValues as any} validationSchema={validationSchema}>
			<FormSelect id="testId" label="Language" name="language" onBlur={mockOnBlur} {...selectProps}>
				<Select.Option id="es">Spanish</Select.Option>
				<Select.Option id="en">English</Select.Option>
				<Select.Option id="fake">Incorrect</Select.Option>
			</FormSelect>
			<button type="submit">Submit</button>
		</Form>
	);
};

describe('FormSelect', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render input', () => {
		getComponent();

		expect(screen.getByDisplayValue('English')).toBeInTheDocument();
	});

	it('should render change selected to value', () => {
		getComponent();

		expect(screen.queryByText('Spanish')).toBeNull();
		userEvent.click(screen.getByDisplayValue('English'));
		userEvent.click(screen.getByText('Incorrect'));
		fireEvent.blur(screen.getByText('Incorrect'));

		expect(screen.queryByText('Incorrect language')).toBe(null);
	});

	it('should render error if wrong value set to dropdown', async () => {
		getComponent();

		userEvent.click(screen.getByDisplayValue('English'));
		fireEvent.blur(screen.getByText('English'));
		userEvent.click(screen.getByText('Incorrect'));

		fireEvent.click(screen.getByText('Submit'));
		await waitFor(() => expect(screen.getByText('Incorrect language')).toBeInTheDocument());
	});

	it('should handle a unique value with single select', async () => {
		getComponent();

		userEvent.click(screen.getByDisplayValue('English'));
		userEvent.click(screen.getByText('Spanish'));
		fireEvent.click(screen.getByText('Submit'));

		await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith({ language: 'es' }, expect.anything()));
	});

	it('should handle a multiple value with multi select', async () => {
		getComponent(
			{ language: ['en'] as any },
			Yup.object({
				language: Yup.array().required()
			}),
			{ isMultiSelect: true }
		);

		userEvent.click(screen.getByDisplayValue('English'));
		userEvent.click(screen.getByText('English'));
		userEvent.click(screen.getByText('Spanish'));
		userEvent.click(screen.getByText('English'));
		fireEvent.click(screen.getByText('Submit'));

		await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith({ language: ['es', 'en'] }, expect.anything()));
	});
});
