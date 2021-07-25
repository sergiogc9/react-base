import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import Loading from './Loading';
import { LoadingProps } from './types';

describe('Loading', () => {
	const getComponent = (props: Partial<LoadingProps> = {}) => {
		return TestUtils.renderWithMockedStore(<Loading {...props} />);
	};

	it('should render loading', () => {
		getComponent();
		expect(screen.getByTestId('loading')).toBeInTheDocument();
	});
});
