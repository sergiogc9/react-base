import React from 'react';
import { screen } from '@testing-library/react';
import { Column } from 'react-table';

import TestUtils from 'lib/tests';
import Table from '..';
import TableTotalResults from '.';

type TestData = {
	id: number;
	name: string;
};

const defaultColumns: Column<TestData>[] = [
	{ accessor: 'id', Header: 'Id' },
	{ accessor: 'name', Header: 'Name' }
];

const defaultData: TestData[] = [
	{ id: 1, name: 'Sergio' },
	{ id: 2, name: 'Carla' },
	{ id: 3, name: 'Pablo' }
];

const Component: React.FC = () => {
	return (
		<Table data={defaultData} columns={defaultColumns}>
			<TableTotalResults render={({ totalResults }) => <div>TOTAL: {totalResults}</div>} />
		</Table>
	);
};

const getComponent = () => {
	return TestUtils.renderWithMockedStore(<Component />);
};

describe('TableTotalResults', () => {
	it('should render the total results', () => {
		getComponent();

		expect(screen.getByText('TOTAL: 3')).toBeInTheDocument();
	});
});
