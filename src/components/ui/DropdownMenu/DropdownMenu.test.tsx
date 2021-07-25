import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import DropdownMenu from '.';
import { DropdownMenuProps } from './types';

const dropdownMenuTestId = 'DropdownMenu';
const text = 'Awesome text';

const renderDropdownMenu = (props?: Partial<DropdownMenuProps>) =>
	TestUtils.renderWithMockedStore(
		<DropdownMenu data-testid={dropdownMenuTestId} Text="add" styling="outlined" {...(props as any)}>
			{text}
		</DropdownMenu>
	);

describe('DropdownMenu component', () => {
	afterEach(cleanup);

	it('should not be visible', () => {
		renderDropdownMenu();
		expect(screen.queryByText(text)).toBeNull();
	});

	it('should be visible', () => {
		renderDropdownMenu({ isVisible: true });
		expect(screen.getByText(text)).toBeInTheDocument();
	});
});
