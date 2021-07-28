import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';

import withErrorBoundary from '.';

const FailingComponent = () => {
	React.useEffect(() => {
		throw new Error('test error');
	}, []);

	return null;
};

const ErrorBoundedFailingComponent = withErrorBoundary(FailingComponent);

const renderComponent = () => TestUtils.renderWithStore(<ErrorBoundedFailingComponent />);

describe('withErrorBoundary HOC', () => {
	it('should render fallback error content', () => {
		renderComponent();

		expect(screen.getByTestId('fallbackError')).toBeInTheDocument();
	});
});
