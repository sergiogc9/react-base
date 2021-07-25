import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import LinkButton from 'components/ui/LinkButton';
import { LinkButtonTextProps } from './types';

const linkButtonTestId = 'LinkButtonText';

const getComponent = (props: Partial<LinkButtonTextProps> = {}) => {
	return TestUtils.renderWithMockedStore(<LinkButton.Text data-testid={linkButtonTestId} {...props} />);
};

describe('LinkButtonText', () => {
	it('should render anchor element', () => {
		getComponent();
		const link = screen.getByTestId(linkButtonTestId);
		expect(link).toBeInTheDocument();
	});
});
