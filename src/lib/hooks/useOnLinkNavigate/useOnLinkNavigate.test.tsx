import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';
import useOnLinkNavigate, { UseOnLinkNavigateArgs } from './useOnLinkNavigate';

const mockNavigate = jest.fn();
jest.mock('react-router', () => {
	const currentPackage = jest.requireActual('react-router');
	return {
		...currentPackage,
		useNavigate: () => mockNavigate
	};
});

const btnText = 'click me';
const EmulatedComponent: React.FC<UseOnLinkNavigateArgs> = props => {
	const { onClick, replace, to } = props;

	const onClicked = useOnLinkNavigate({ onClick, replace, to });
	return (
		<button onClick={onClicked} type="button">
			{btnText}
		</button>
	);
};

const mockOnClick = jest.fn();
const renderComponent = (props: Partial<UseOnLinkNavigateArgs> = {}) =>
	TestUtils.renderWithMockedStore(
		<EmulatedComponent onClick={mockOnClick} replace={false} to="/internal" {...props} />
	);

describe('useOnLinkNavigate', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should call useNavigate if relative url', () => {
		renderComponent();

		userEvent.click(screen.getByText(btnText));

		expect(mockNavigate).toHaveBeenCalled();
	});

	it('should not call useNavigate if absolute url', () => {
		renderComponent({ to: 'https://google.es' });

		userEvent.click(screen.getByText(btnText));

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('should not call useNavigate to not provided', () => {
		renderComponent({ to: undefined });

		userEvent.click(screen.getByText(btnText));

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('should call onclick handler', () => {
		renderComponent();

		userEvent.click(screen.getByText(btnText));

		expect(mockOnClick).toHaveBeenCalled();
	});

	it('should not call onclick handler if not passed', () => {
		renderComponent({ onClick: undefined });

		userEvent.click(screen.getByText(btnText));
		expect(mockOnClick).not.toHaveBeenCalled();
	});
});
