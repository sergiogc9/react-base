import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import TableHeaderGroup from '.';
import { TableHeaderGroupProps } from './types';

const tableHeaderGroupTestId = 'TableHeaderGroup';

const getComponent = (props: Partial<TableHeaderGroupProps> = {}) => {
	return TestUtils.renderWithMockedStore(<TableHeaderGroup data-testid={tableHeaderGroupTestId} {...props} />);
};

describe('TableHeaderGroup', () => {
	it('should render group row with correct styles', () => {
		getComponent();

		expect(screen.getByTestId(tableHeaderGroupTestId)).toHaveStyle(`
			align-items: stretch;
			border-radius: 8px;
			border-style: solid;
			border-width: 1px;
			min-height: 48px;
			width: 100%;
		`);
	});
});
