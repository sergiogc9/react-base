import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import DropdownMenuItem from './styled';
import { DropdownMenuItemProps } from './types';

const dropdownMenuItemTestId = 'DropdownMenuItem';
const text = 'Awesome text';

const renderDropdownMenuItem = (props?: Partial<DropdownMenuItemProps>) =>
	TestUtils.renderWithMockedStore(
		<DropdownMenuItem data-testid={dropdownMenuItemTestId} Text="add" styling="outlined" {...(props as any)}>
			{text}
		</DropdownMenuItem>
	);

describe('DropdownMenuItem component', () => {
	afterEach(cleanup);

	it('should render the text', () => {
		renderDropdownMenuItem();
		expect(screen.getByText(text)).toBeInTheDocument();
	});
});
