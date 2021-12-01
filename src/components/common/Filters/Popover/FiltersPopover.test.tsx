import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Box } from '@sergiogc9/react-ui';

import TestUtils from 'lib/tests';
import { renderWithMockedStore } from 'lib/tests/redux';
import locales from 'i18n/locales/en.json';

import FiltersProvider, { FiltersProviderProps } from '../Provider';
import { Filter, FilterField } from '..';
import FiltersPopover, { FiltersPopoverProps } from '.';

const filter: Filter = { condition: 'contains', field: 'fake_text', id: 'fake-id', type: 'text', value: 'Awesome' };
const field: FilterField = { field: filter.field, text: 'Fake', type: filter.type };
const field2: FilterField = { field: 'fake_field', text: 'Second field', type: 'number' };

const mockOnClose = jest.fn();
const mockOnFiltersChange = jest.fn();
const FakeComponent: React.FC<{
	props: Partial<FiltersPopoverProps>;
	providerProps: Partial<FiltersProviderProps>;
}> = ({ props = {}, providerProps = {} }) => {
	const [isVisible, setIsVisible] = React.useState(false);

	const containerRef = React.useRef(null);

	return (
		<Box ref={containerRef} height={100} width={100}>
			<button onClick={() => setIsVisible(true)} type="button">
				Open
			</button>
			<FiltersProvider
				containerRef={containerRef}
				defaultFilters={[filter]}
				fields={[field, field2]}
				onFiltersChange={mockOnFiltersChange}
				{...providerProps}
			>
				<FiltersPopover editFilterId={filter.id} isVisible={isVisible} onClose={mockOnClose} {...props} />
			</FiltersProvider>
		</Box>
	);
};

const renderComponent = (props: Partial<FiltersPopoverProps> = {}, providerProps: Partial<FiltersProviderProps> = {}) =>
	renderWithMockedStore(<FakeComponent props={props} providerProps={providerProps} />);

describe('FiltersPopover', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		TestUtils.simulateScreenWidthChange(1800);
	});

	it('should not render popover in desktop', () => {
		renderComponent();

		expect(screen.queryByTestId('filtersPopover')?.querySelector('form')).toBeNull();
	});

	it('should not render popover in mobile', () => {
		TestUtils.simulateScreenWidthChange(300);
		renderComponent();

		expect(screen.queryByTestId('filtersPopoverMobile')).toBeNull();
	});

	it('should render popover in desktop', () => {
		renderComponent();

		userEvent.click(screen.getByText('Open'));

		expect(screen.queryByTestId('filtersPopover')).toBeInTheDocument();
	});

	it('should render popover in mobile', () => {
		TestUtils.simulateScreenWidthChange(300);
		renderComponent();

		userEvent.click(screen.getByText('Open'));

		expect(screen.queryByTestId('filtersPopoverMobile')).toBeInTheDocument();
	});

	it('should close popover when clicking cancel btn', async () => {
		renderComponent();

		userEvent.click(screen.getByText('Open'));

		await waitFor(() => expect(screen.getByText(locales.form.buttons.cancel)).toBeInTheDocument());
		userEvent.click(screen.getByText(locales.form.buttons.cancel));

		expect(mockOnClose).toHaveBeenCalled();
	});

	it('should close popover when clicking close icon btn', () => {
		TestUtils.simulateScreenWidthChange(300);
		renderComponent();

		userEvent.click(screen.getByText('Open'));

		userEvent.click(screen.getByTestId('filtersPopoverMobileCloseBtn'));

		expect(mockOnClose).toHaveBeenCalled();
	});

	it('should show field input if new filter', async () => {
		renderComponent({ editFilterId: 'new' });

		userEvent.click(screen.getByText('Open'));

		await waitFor(() => expect(screen.getByTestId('filtersPopoverFieldsSelect')).toBeInTheDocument());
	});

	it('should add new filter after filling it', async () => {
		renderComponent({ editFilterId: 'new' });

		userEvent.click(screen.getByText('Open'));

		await waitFor(() => expect(screen.getByTestId('filtersTextFilterValueTextField')).toBeInTheDocument());

		const input = screen.getByTestId('filtersTextFilterValueTextField').querySelector('input')!;
		userEvent.type(input, 'Nice');
		fireEvent.blur(input);

		const addBtn = screen.getByText(locales.form.buttons.add).closest('button')!;
		await waitFor(() => expect(addBtn).toBeEnabled());
		userEvent.click(addBtn);

		await waitFor(() =>
			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				expect.objectContaining({ ...filter, id: expect.stringContaining('text-'), value: 'Nice' }),
				filter
			])
		);
	});

	it('should edit filter after filling it', async () => {
		renderComponent({ editFilterId: filter.id });

		userEvent.click(screen.getByText('Open'));

		await waitFor(() => expect(screen.getByTestId('filtersTextFilterValueTextField')).toBeInTheDocument());

		const input = screen.getByTestId('filtersTextFilterValueTextField').querySelector('input')!;
		userEvent.clear(input);
		userEvent.type(input, 'Nice');
		fireEvent.blur(input);

		const saveBtn = screen.getByText(locales.form.buttons.save).closest('button')!;
		await waitFor(() => expect(saveBtn).toBeEnabled());
		userEvent.click(saveBtn);

		await waitFor(() => expect(mockOnFiltersChange).toHaveBeenCalledWith([{ ...filter, value: 'Nice' }]));
	});

	it('should change filter type when adding a filter', async () => {
		renderComponent({ editFilterId: 'new' });

		userEvent.click(screen.getByText('Open'));

		await waitFor(() => expect(screen.getByTestId('filtersPopoverFieldsSelect')).toBeInTheDocument());
		expect(screen.getByTestId('filtersTextFilterValueTextField')).toBeInTheDocument();

		const input = screen.getByTestId('filtersPopoverFieldsSelect').querySelector('input')!;
		userEvent.click(input);

		await waitFor(() => expect(screen.getByText(field2.text)).toBeInTheDocument());
		userEvent.click(screen.getByText(field2.text));

		expect(screen.queryByTestId('filtersTextFilterValueTextField')).toBeNull();
		expect(screen.getByTestId('filtersNumberFilterValueTextField')).toBeInTheDocument();
	});
});
