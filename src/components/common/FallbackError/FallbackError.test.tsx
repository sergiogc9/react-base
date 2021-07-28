import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';
import locales from 'i18n/locales/en.json';

import FallbackError from './FallbackError';
import { FallbackErrorProps } from './types';

const mockOnReload = jest.fn();
Object.defineProperty(window, 'location', {
	value: { reload: mockOnReload }
});

const renderComponent = (props: Partial<FallbackErrorProps> = {}) =>
	TestUtils.renderWithStore(<FallbackError error={new Error('fake error')} resetErrorBoundary={() => {}} {...props} />);

describe('FallbackError', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render title, content and button texts', () => {
		renderComponent();

		expect(screen.getByText(locales.general.error.btn_text)).toBeInTheDocument();
		expect(screen.getByText(locales.general.error.title_text)).toBeInTheDocument();
	});

	it('should reload page when clicking reload button', () => {
		renderComponent();

		userEvent.click(screen.getByText(locales.general.error.btn_text));

		expect(mockOnReload).toHaveBeenCalled();
	});
});
