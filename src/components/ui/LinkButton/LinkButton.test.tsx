import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';
import LinkButton from 'components/ui/LinkButton';
import { LinkButtonProps } from './types';

const linkButtonTestId = 'LinkButton';

const mockOnClick = jest.fn();
const mockNavigate = jest.fn();
jest.mock('react-router', () => {
	const currentPackage = jest.requireActual('react-router');
	return {
		...currentPackage,
		useNavigate: () => mockNavigate
	};
});

const getComponent = (props: Partial<LinkButtonProps> = {}) => {
	return TestUtils.renderWithMockedStore(
		<LinkButton data-testid={linkButtonTestId} to="/fake" {...props}>
			<LinkButton.Text>Awesome Link</LinkButton.Text>
		</LinkButton>
	);
};

describe('LinkButton', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render anchor element', () => {
		getComponent();
		const linkButton = screen.getByTestId(linkButtonTestId);
		expect(linkButton).toBeInTheDocument();
	});

	it('should call onClick prop if clicked', () => {
		getComponent({ onClick: mockOnClick });
		const linkButton = screen.getByTestId(linkButtonTestId);
		userEvent.click(linkButton);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('should navigate with relative link', () => {
		getComponent();
		const linkButton = screen.getByTestId(linkButtonTestId);
		userEvent.click(linkButton);
		expect(mockNavigate).toHaveBeenCalledTimes(1);
	});

	it('should navigate with mailto link', () => {
		getComponent({ to: 'mailto:fake@email.com' });
		const linkButton = screen.getByTestId(linkButtonTestId);
		userEvent.click(linkButton);
		expect(mockNavigate).toHaveBeenCalledTimes(0);
	});

	it('should navigate with tel link', () => {
		getComponent({ to: 'tel:999999999' });
		const linkButton = screen.getByTestId(linkButtonTestId);
		userEvent.click(linkButton);
		expect(mockNavigate).toHaveBeenCalledTimes(0);
	});

	it('should not call navigate with external link', () => {
		getComponent({ to: 'https://fake.com' });
		const linkButton = screen.getByTestId(linkButtonTestId);
		userEvent.click(linkButton);
		expect(mockNavigate).toHaveBeenCalledTimes(0);
	});
});
