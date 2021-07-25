import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import TableSkeleton, { TableSkeletonProps } from '.';

const renderComponent = (props: Partial<TableSkeletonProps> = {}) => {
	return TestUtils.renderWithMockedStore(
		<TableSkeleton {...props}>
			<TableSkeleton.Toolbar />
			<TableSkeleton.Content />
		</TableSkeleton>
	);
};

describe('TableSkeleton', () => {
	afterEach(cleanup);

	it('should render skeleton', () => {
		renderComponent();

		expect(screen.getByTestId('skeleton')).toBeInTheDocument();
		expect(screen.queryAllByTestId('skeleton-rect')).not.toBeNull();
	});
});
