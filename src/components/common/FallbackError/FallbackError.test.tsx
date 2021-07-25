import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import FallbackError from './FallbackError';

const renderComponent = () => TestUtils.renderWithStore(<FallbackError />);

describe('FallbackError', () => {
	it('should render error label', () => {
		renderComponent();

		expect(screen.getByText('Error')).toBeInTheDocument();
	});
});
