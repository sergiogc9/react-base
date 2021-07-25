import React from 'react';
import { screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import TableCellDefault from '.';

const cellValue = 'Fake value';
const tableCellDefaultTestId = 'TableCellDefault';

const getComponent = (props: any = {}) => {
	return TestUtils.renderWithMockedStore(
		<TableCellDefault data-testid={tableCellDefaultTestId} value={cellValue} {...props} />
	);
};

describe('TableCellDefault', () => {
	it('should render cell with correct value', () => {
		getComponent();

		expect(screen.getByText(cellValue)).toBeInTheDocument();
	});

	it('should render cell with children', () => {
		getComponent({ children: <div>Nice</div> });

		expect(screen.getByText('Nice')).toBeInTheDocument();
	});
});
