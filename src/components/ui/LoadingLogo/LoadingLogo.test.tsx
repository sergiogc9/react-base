import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import LoadingLogo from './LoadingLogo';
import { LoadingLogoProps } from './types';

describe('LoadingLogo', () => {
	const getComponent = (props: Partial<LoadingLogoProps> = {}) => {
		return TestUtils.renderWithMockedStore(<LoadingLogo {...props} />);
	};

	it('should render loading spinner', () => {
		getComponent();

		expect(screen.getByTestId('loadingLogoSpinner')).toBeInTheDocument();
	});
});
