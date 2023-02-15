import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flex } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';

import FiltersContext from '../Context';
import FiltersProvider from '.';
import { Filter, FilterDate, FilterField, FilterNumber, FilterText } from '..';
import { FiltersProviderProps } from './types';

const dateFilter: FilterDate = {
	field: 'fake-date',
	id: 'fake-id-1',
	type: 'date',
	value: 'today'
};
const numberFilter: FilterNumber = { condition: 'less', field: 'fake', id: 'fake-id-2', type: 'number', value: 100 };
const textFilter: FilterText = {
	condition: 'contains',
	field: 'fake_text',
	id: 'fake-id-3',
	type: 'text',
	value: 'Awesome'
};

const defaultFilters: Filter[] = [numberFilter, textFilter];
const defaultFields: FilterField[] = [{ field: 'name', text: 'First name', type: 'text' }];

const mockOnFiltersChange = jest.fn();
const ConsumerComponent = () => {
	const { addFilter, clearAllFilters, fields, filters, removeFilter, updateFilter } = React.useContext(FiltersContext);

	return (
		<div>
			{fields.map(field => (
				<div key={field.field}>
					<span>FIELD</span>
					<span>{field.field}</span>
				</div>
			))}
			{filters.map(filter => (
				<div key={filter.id}>
					<span>FILTER</span>
					<span>{filter.type}</span>
					<span>{filter.value.toString()}</span>
				</div>
			))}
			<button onClick={() => addFilter(dateFilter)} type="button">
				Add
			</button>
			<button onClick={() => clearAllFilters()} type="button">
				Clear
			</button>
			<button onClick={() => removeFilter(filters[0])} type="button">
				Remove
			</button>
			<button onClick={() => updateFilter({ ...textFilter, value: 'Awesome modified' })} type="button">
				Update
			</button>
		</div>
	);
};

const FakeComponent: React.FC<Partial<FiltersProviderProps>> = props => {
	const containerRef = React.useRef(null);

	return (
		<Flex ref={containerRef} height={100} width={100}>
			<FiltersProvider containerRef={containerRef} defaultFilters={defaultFilters} fields={defaultFields} {...props}>
				<ConsumerComponent />
			</FiltersProvider>
		</Flex>
	);
};

const renderComponent = (props: Partial<FiltersProviderProps> = {}) =>
	renderWithMockedStore(<FakeComponent {...props} />);

describe('FiltersProvider', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render fields', () => {
		renderComponent();

		expect(screen.getByText(defaultFields[0].field)).toBeInTheDocument();
	});

	it('should render default filters', () => {
		renderComponent();

		expect(screen.getByText(numberFilter.value)).toBeInTheDocument();
		expect(screen.getByText(textFilter.value)).toBeInTheDocument();
	});

	it('should not render filters if no default filters are provided', () => {
		renderComponent({ defaultFilters: undefined });

		expect(screen.queryByText('FILTER')).toBeNull();
	});

	it('should add a filter', () => {
		renderComponent();

		userEvent.click(screen.getByText('Add'));

		expect(screen.getByText(dateFilter.value.toString())).toBeInTheDocument();
		expect(screen.queryAllByText('FILTER')).toHaveLength(3);
	});

	it('should remove a filter', () => {
		renderComponent();

		userEvent.click(screen.getByText('Remove'));

		expect(screen.queryByText(numberFilter.value.toString())).toBeNull();
		expect(screen.queryAllByText('FILTER')).toHaveLength(1);
	});

	it('should update a filter', () => {
		renderComponent();

		userEvent.click(screen.getByText('Update'));

		expect(screen.getByText('Awesome modified')).toBeInTheDocument();
		expect(screen.queryAllByText('FILTER')).toHaveLength(2);
	});

	it('should clear all filters', () => {
		renderComponent();

		userEvent.click(screen.getByText('Clear'));

		expect(screen.queryByText(numberFilter.value.toString())).toBeNull();
		expect(screen.queryByText(textFilter.value)).toBeNull();
		expect(screen.queryAllByText('FILTER')).toHaveLength(0);
	});

	it('should call onFiltersChange if provided', async () => {
		renderComponent({ onFiltersChange: mockOnFiltersChange });

		userEvent.click(screen.getByText('Clear'));

		await waitFor(() => expect(mockOnFiltersChange).toHaveBeenCalledWith([]));
	});
});
