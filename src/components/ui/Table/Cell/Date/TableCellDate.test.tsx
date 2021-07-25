import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import TableCellDate from '.';

const tableCellDateTestId = 'TableCellDate';

const getComponent = (props: any = {}) => {
	return TestUtils.renderWithMockedStore(<TableCellDate data-testid={tableCellDateTestId} {...props} />);
};

describe('TableCellDate', () => {
	it('should render cell with correct locale string', () => {
		getComponent({ value: '2021-06-15T12:34:18.547Z' });

		expect(screen.getByText('Jun 15, 2021')).toBeInTheDocument();
	});
});
