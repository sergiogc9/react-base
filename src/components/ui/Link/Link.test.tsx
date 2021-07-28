import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';
import Link from 'components/ui/Link';
import { LinkProps } from './types';

const linkTestId = 'Link';

const mockOnClick = jest.fn();
const mockNavigate = jest.fn();
jest.mock('react-router', () => {
	const currentPackage = jest.requireActual('react-router');
	return {
		...currentPackage,
		useNavigate: () => mockNavigate
	};
});

const getComponent = (props: Partial<LinkProps> = {}) => {
	return TestUtils.renderWithMockedStore(
		<Link data-testid={linkTestId} to="/fake" {...props}>
			<Link.Text>Awesome Link</Link.Text>
		</Link>
	);
};

describe('Link', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render anchor element', () => {
		getComponent();
		const link = screen.getByTestId(linkTestId);
		expect(link).toBeInTheDocument();
	});

	it('should call onClick prop if clicked', () => {
		getComponent({ onClick: mockOnClick });
		const link = screen.getByTestId(linkTestId);
		userEvent.click(link);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('should set href as null if we set the link as button', () => {
		getComponent({ as: 'button' });
		const link = screen.getByTestId(linkTestId);
		expect(link).not.toHaveAttribute('href');
	});

	it('should navigate with relative link', () => {
		getComponent();
		const link = screen.getByTestId(linkTestId);
		userEvent.click(link);
		expect(mockNavigate).toHaveBeenCalledTimes(1);
	});

	it('should navigate with mailto link', () => {
		getComponent({ to: 'mailto:fake@email.com' });
		const link = screen.getByTestId(linkTestId);
		userEvent.click(link);
		expect(mockNavigate).toHaveBeenCalledTimes(0);
	});

	it('should navigate with tel link', () => {
		getComponent({ to: 'tel:999999999' });
		const link = screen.getByTestId(linkTestId);
		userEvent.click(link);
		expect(mockNavigate).toHaveBeenCalledTimes(0);
	});

	it('should not call navigate with external link', () => {
		getComponent({ to: 'https://fake.com' });
		const link = screen.getByTestId(linkTestId);
		userEvent.click(link);
		expect(mockNavigate).toHaveBeenCalledTimes(0);
	});

	it('should render the children text as string with a LinkText component', () => {
		TestUtils.renderWithMockedStore(
			<Link data-testid={linkTestId} to="/fake">
				Awesome text
			</Link>
		);

		const link = screen.getByTestId(linkTestId);

		expect(link.querySelector('a > span')).toBeInTheDocument();
	});

	it('should render the children text as string array with a LinkText component', () => {
		TestUtils.renderWithMockedStore(
			<Link data-testid={linkTestId} to="/fake">
				{['Awesome text']}
			</Link>
		);

		const link = screen.getByTestId(linkTestId);

		expect(link.querySelector('a > span')).toBeInTheDocument();
	});
});
