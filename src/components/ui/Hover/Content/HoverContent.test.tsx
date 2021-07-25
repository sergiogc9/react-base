import React from 'react';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';
import HoverContext from 'components/ui/Hover/Context';
import Hover from 'components/ui/Hover';
import { HoverContentProps } from './types';

const hoverContentTestId = 'HoverContent';
const text = 'Awesome content';

const mockOnHoverChanged = jest.fn();
const renderHoverContent = (props?: Partial<HoverContentProps>, isHover = false) =>
	TestUtils.renderWithMockedStore(
		<HoverContext.Provider value={{ isHover, onHoverChanged: mockOnHoverChanged }}>
			<Hover.Content data-testid={hoverContentTestId} {...props}>
				{props?.children || text}
			</Hover.Content>
		</HoverContext.Provider>
	);

describe('HoverContent component', () => {
	afterEach(cleanup);

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should not render content by default', () => {
		renderHoverContent();
		expect(screen.getByText(text)).not.toBeVisible();
	});

	it('should render content if hover', () => {
		renderHoverContent({}, true);
		expect(screen.getByText(text)).toBeVisible();
	});

	it('should call onHoverChanged from context when hover', () => {
		renderHoverContent();
		const content = screen.getByText(text);
		userEvent.hover(content);
		expect(mockOnHoverChanged).toHaveBeenCalledTimes(1);
		expect(mockOnHoverChanged).toHaveBeenCalledWith(true);
	});

	it('should call onHoverChanged from context when exiting hover', () => {
		renderHoverContent();
		const content = screen.getByText(text);
		userEvent.hover(content);
		fireEvent.mouseOut(content);
		expect(mockOnHoverChanged).toHaveBeenCalledTimes(2);
		expect(mockOnHoverChanged).toHaveBeenCalledWith(true);
		expect(mockOnHoverChanged).toHaveBeenCalledWith(false);
	});
});
