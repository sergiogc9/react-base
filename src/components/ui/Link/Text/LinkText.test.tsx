import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import Link from 'components/ui/Link';
import { LinkTextProps } from './types';

const linkTestId = 'Link';

const getComponent = (props: Partial<LinkTextProps> = {}) => {
	return TestUtils.renderWithMockedStore(<Link.Text data-testid={linkTestId} {...props} />);
};

describe('Link', () => {
	it('should render anchor element', () => {
		getComponent();
		const link = screen.getByTestId(linkTestId);
		expect(link).toBeInTheDocument();
	});
});
