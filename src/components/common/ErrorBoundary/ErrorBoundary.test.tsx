import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';

import ErrorBoundary from '.';

const FailingComponent = () => {
	React.useEffect(() => {
		throw new Error('test error');
	}, []);

	return null;
};

const renderComponent = () =>
	TestUtils.renderWithStore(
		<ErrorBoundary>
			<FailingComponent />
		</ErrorBoundary>
	);

describe('ErrorBoundary', () => {
	it('should render fallback error content', () => {
		renderComponent();

		expect(screen.getByTestId('fallbackError')).toBeInTheDocument();
	});
});
