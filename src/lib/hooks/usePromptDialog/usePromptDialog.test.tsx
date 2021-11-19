import React from 'react';
import { useNavigate, UNSAFE_NavigationContext } from 'react-router';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestUtils from 'lib/tests';

import usePromptDialog from '.';

const mockBlock = jest.fn();
const mockConfirm = jest.fn();
const mockRetry = jest.fn();
const mockUnblock = jest.fn();

const NAVIGATE_BUTTON_TEXT = 'NavigateButton';
const SWITCH_TEXT = 'SwitchPromptEnabledState';

jest.useFakeTimers('modern');

const MockComponent: React.FC = () => {
	const [isPromptDialogEnabled, setIsPromptDialogEnabled] = React.useState(false);

	const navigate = useNavigate();

	usePromptDialog(isPromptDialogEnabled, 'Are you sure you want to leave this page?');

	return (
		<>
			<button onClick={() => setIsPromptDialogEnabled(oldValue => !oldValue)} type="button">
				{SWITCH_TEXT}
			</button>
			<button onClick={() => navigate('/test')} type="button">
				{NAVIGATE_BUTTON_TEXT}
			</button>
		</>
	);
};

const MockComponentNavigationProvider: React.FC = () => {
	const navigationContext = React.useContext(UNSAFE_NavigationContext);
	return (
		// eslint-disable-next-line react/jsx-pascal-case
		<UNSAFE_NavigationContext.Provider
			value={{
				basename: '/',
				static: false,
				navigator: { ...navigationContext.navigator, block: mockBlock }
			}}
		>
			<MockComponent />
		</UNSAFE_NavigationContext.Provider>
	);
};

const renderComponent = () => {
	return TestUtils.renderWithMockedStore(<MockComponentNavigationProvider />);
};

describe('usePrompt dialog hook', () => {
	beforeEach(() => {
		jest.resetAllMocks();

		mockConfirm.mockReturnValue(true);
		Object.defineProperty(window, 'confirm', { writable: true, value: mockConfirm });

		mockBlock.mockImplementation(blocker => {
			const tx = { retry: mockRetry };
			setTimeout(() => blocker(tx), 1000);
			return mockUnblock;
		});
	});

	it('should block the navigation when hook is enabled', () => {
		renderComponent();

		const switchButton = screen.getByText(SWITCH_TEXT);

		userEvent.click(switchButton);

		expect(mockBlock).toHaveBeenCalled();
	});

	it('should not block navigation neither call the unblock method', () => {
		renderComponent();

		expect(mockUnblock).not.toHaveBeenCalled();
	});

	it('should block the navigation if hook is enabled and unblock the navigation if hook is disabled', () => {
		renderComponent();

		const switchButton = screen.getByText(SWITCH_TEXT);
		userEvent.click(switchButton);

		expect(mockBlock).toHaveBeenCalled();

		userEvent.click(switchButton);

		expect(mockUnblock).toHaveBeenCalled();
	});

	it('should open a confirm dialog on navigation and continue on confirmed', async () => {
		renderComponent();

		const switchButton = screen.getByText(SWITCH_TEXT);
		userEvent.click(switchButton);

		expect(mockBlock).toHaveBeenCalled();

		const button = screen.getByText(NAVIGATE_BUTTON_TEXT);
		userEvent.click(button);

		jest.runAllTimers();

		await waitFor(() => expect(window.confirm).toHaveBeenCalled());
		expect(mockRetry).toHaveBeenCalled();
	});

	it('should open a confirm dialog on navigation and continue blocked if cancelled', async () => {
		mockConfirm.mockReturnValueOnce(false);

		renderComponent();

		const switchButton = screen.getByText(SWITCH_TEXT);
		userEvent.click(switchButton);

		expect(mockBlock).toHaveBeenCalled();

		const button = screen.getByText(NAVIGATE_BUTTON_TEXT);
		userEvent.click(button);

		jest.runAllTimers();

		await waitFor(() => expect(window.confirm).toHaveBeenCalled());
		expect(mockRetry).not.toHaveBeenCalled();
	});
});
