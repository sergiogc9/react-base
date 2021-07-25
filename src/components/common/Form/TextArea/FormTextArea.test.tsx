import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import * as Yup from 'yup';

import TestUtils from 'lib/tests';
import Form from 'components/common/Form';
import FormTextArea from 'components/common/Form/TextArea';

const textAreaTestId = 'AwesomeTextArea';

let onSubmitMock = jest.fn();
describe('FormTextArea', () => {
	const getComponent = (initialValues = { textarea: '' }) => {
		return TestUtils.renderWithMockedStore(
			<Form
				onSubmit={onSubmitMock}
				initialValues={initialValues}
				validationSchema={Yup.object({
					textarea: Yup.string().required('Awesome textarea error')
				})}
			>
				<FormTextArea data-testid={textAreaTestId} label="TextArea" name="textarea" />
				<button type="submit">Submit</button>
			</Form>
		);
	};

	beforeEach(() => {
		onSubmitMock = jest.fn();
	});

	it('should render textarea', () => {
		getComponent();
		const textAreaTest = screen.getByTestId(textAreaTestId);
		const textarea = textAreaTest.querySelector('textarea[label="TextArea"]')!;
		expect(textarea).toBeInTheDocument();
	});

	it('should not render error if not touched', () => {
		getComponent({ textarea: 'wrong-textarea' });
		expect(screen.queryByText('Awesome textarea error')).toBe(null);
	});

	it('should render error if empty textarea', async () => {
		getComponent({ textarea: '' });
		fireEvent.click(screen.getByText('Submit'));
		await waitFor(() => expect(screen.getByText('Awesome textarea error')).toBeInTheDocument());
	});
});
