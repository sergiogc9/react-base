import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import DropdownMenuFooter from './styled';
import { DropdownMenuFooterProps } from './types';

const dropdownMenuFooterTestId = 'DropdownMenuFooter';
const text = 'Awesome text';

const renderDropdownMenuFooter = (props?: Partial<DropdownMenuFooterProps>) =>
	TestUtils.renderWithMockedStore(
		<DropdownMenuFooter data-testid={dropdownMenuFooterTestId} Text="add" styling="outlined" {...(props as any)}>
			{text}
		</DropdownMenuFooter>
	);

describe('DropdownMenuFooter component', () => {
	afterEach(cleanup);

	it('should render the text', () => {
		renderDropdownMenuFooter();
		expect(screen.getByText(text)).toBeInTheDocument();
	});
});
