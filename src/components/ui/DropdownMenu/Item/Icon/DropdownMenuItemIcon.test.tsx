import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import DropdownMenuItemIcon from './styled';
import { DropdownMenuItemIconProps } from './types';

const dropdownMenuItemIconTestId = 'DropdownMenuItemIcon';

const renderDropdownMenuItemIcon = (props?: Partial<DropdownMenuItemIconProps>) =>
	TestUtils.renderWithMockedStore(
		<DropdownMenuItemIcon data-testid={dropdownMenuItemIconTestId} icon="add" styling="outlined" {...(props as any)} />
	);

describe('DropdownMenuItemIcon component', () => {
	afterEach(cleanup);

	it('should render the icon', () => {
		renderDropdownMenuItemIcon();
		expect(screen.getByTestId(dropdownMenuItemIconTestId)).toBeInTheDocument();
	});
});
