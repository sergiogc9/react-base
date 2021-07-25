import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import TableToolbar from '.';
import { TableToolbarProps } from './types';

const tableToolbarTestId = 'TableToolbar';

const getComponent = (props: Partial<TableToolbarProps> = {}) => {
	return TestUtils.renderWithMockedStore(<TableToolbar data-testid={tableToolbarTestId} {...props} />);
};

describe('TableToolbar', () => {
	it('should render toolbar with correct styles', () => {
		getComponent();

		expect(screen.getByTestId(tableToolbarTestId)).toHaveStyle(`
			align-items: center;
			min-height: 50px;
			width: 100%;
		`);
	});
});
