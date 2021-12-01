import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Box } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';

import { Filter, FilterField, FilterDate, FilterFieldDate } from '../../../types';
import FiltersChips, { FiltersChipsProps } from '../../../Chips';
import FilterProvider, { FiltersProviderProps } from '../../../Provider';
import FiltersFactory from '../../FiltersFactory';

const dateFilter: Filter = { field: 'fake', id: 'fake-id', type: 'date', value: 'today' };
const dateField: FilterField = { field: dateFilter.field, text: 'Fake', type: dateFilter.type };

const getFilter = (filterData: Partial<FilterDate> = {}, fieldData: Partial<FilterFieldDate> = {}) => {
	return FiltersFactory.getFilter({ ...dateFilter, ...filterData }, [{ ...dateField, ...fieldData }]);
};

const FakeComponent: React.FC<{
	props: Partial<FiltersChipsProps>;
	providerProps: Partial<FiltersProviderProps>;
}> = ({ props = {}, providerProps = {} }) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider containerRef={containerRef} defaultFilters={[dateFilter]} fields={[dateField]} {...providerProps}>
			<Box ref={containerRef}>
				<FiltersChips {...props} />
			</Box>
		</FilterProvider>
	);
};

const renderComponent = (props: Partial<FiltersChipsProps> = {}, providerProps: Partial<FiltersProviderProps> = {}) =>
	renderWithMockedStore(<FakeComponent props={props} providerProps={providerProps} />);

describe('BateFilter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct text for today value', () => {
		const filter = getFilter({ value: 'today' });

		expect(filter.renderChipText()).toBe(`${dateField.text}: Today`);
	});

	it('should return correct text for yesterday value', () => {
		const filter = getFilter({ value: 'yesterday' });

		expect(filter.renderChipText()).toBe(`${dateField.text}: Yesterday`);
	});

	it('should return correct text for last week value', () => {
		const filter = getFilter({ value: 'last_week' });

		expect(filter.renderChipText()).toBe(`${dateField.text}: Last 7 days`);
	});

	it('should return correct text for last 2 weeks value', () => {
		const filter = getFilter({ value: 'last_two_weeks' });

		expect(filter.renderChipText()).toBe(`${dateField.text}: Last 15 days`);
	});

	it('should render form', async () => {
		renderComponent();

		userEvent.click(screen.getByTestId('filtersChipsChip'));
		await waitFor(() => expect(screen.getByTestId('filtersDateFilterValueSelect')).toBeInTheDocument());
	});
});
