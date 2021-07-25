import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import DropdownMenuItemText from './styled';
import { DropdownMenuItemTextProps } from './types';

const dropdownMenuItemTextTestId = 'DropdownMenuItemText';
const text = 'Awesome text';

const renderDropdownMenuItemText = (props?: Partial<DropdownMenuItemTextProps>) =>
	TestUtils.renderWithMockedStore(
		<DropdownMenuItemText data-testid={dropdownMenuItemTextTestId} Text="add" styling="outlined" {...(props as any)}>
			{text}
		</DropdownMenuItemText>
	);

describe('DropdownMenuItemText component', () => {
	afterEach(cleanup);

	it('should render the text', () => {
		renderDropdownMenuItemText();
		expect(screen.getByText(text)).toBeInTheDocument();
	});
});
