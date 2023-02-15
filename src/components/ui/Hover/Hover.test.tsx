import React from 'react';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flex } from '@sergiogc9/react-ui';

import TestUtils from 'lib/tests';
import Hover from 'components/ui/Hover';
import { HoverProps } from './types';

const hoverTestId = 'Hover';
const contentText = 'Awesome content';
const text = 'Awesome text';

const renderHover = (props?: Partial<HoverProps>) =>
	TestUtils.renderWithMockedStore(
		<Hover data-testid={hoverTestId} {...props}>
			<Flex>{text}</Flex>
			<Hover.Content>{contentText}</Hover.Content>
		</Hover>
	);

describe('Hover component', () => {
	afterEach(cleanup);

	it('should render text', () => {
		renderHover();
		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it('should not render content by default', () => {
		renderHover();
		expect(screen.getByText(contentText)).not.toBeVisible();
	});

	it('should render hover content if hovering the text', async () => {
		renderHover();
		const contentDiv = screen.getByText(contentText);
		userEvent.hover(contentDiv);
		await waitFor(() => expect(screen.getByText(contentText)).toBeVisible());
	});
});
