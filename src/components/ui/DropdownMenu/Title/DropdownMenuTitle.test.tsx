import React from 'react';
import { cleanup, screen } from '@testing-library/react';

import TestUtils from 'lib/tests';
import DropdownMenuTitle from './styled';
import { DropdownMenuTitleProps } from './types';

const dropdownMenuTitleTestId = 'DropdownMenuTitle';
const text = 'Awesome text';

const renderDropdownMenuTitle = (props?: Partial<DropdownMenuTitleProps>) =>
	TestUtils.renderWithMockedStore(
		<DropdownMenuTitle data-testid={dropdownMenuTitleTestId} Text="add" styling="outlined" {...(props as any)}>
			{text}
		</DropdownMenuTitle>
	);

describe('DropdownMenuTitle component', () => {
	afterEach(cleanup);

	it('should render the text', () => {
		renderDropdownMenuTitle();
		expect(screen.getByText(text)).toBeInTheDocument();
	});
});
