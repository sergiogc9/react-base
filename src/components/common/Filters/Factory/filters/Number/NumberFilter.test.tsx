import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flex } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';

import { Filter, FilterField, FilterNumber, FilterFieldNumber } from '../../../types';
import FiltersChips, { FiltersChipsProps } from '../../../Chips';
import FilterProvider, { FiltersProviderProps } from '../../../Provider';
import FiltersFactory from '../../FiltersFactory';

const numberFilter: Filter = { condition: 'equal', field: 'fake_text', id: 'fake-id', type: 'number', value: 10 };
const numberField: FilterField = { field: numberFilter.field, text: 'Fake', type: numberFilter.type };

const getFilter = (filterData: Partial<FilterNumber> = {}, fieldData: Partial<FilterFieldNumber> = {}) => {
	return FiltersFactory.getFilter({ ...numberFilter, ...filterData }, [{ ...numberField, ...fieldData }]);
};

const FakeComponent: React.FC<{
	props: Partial<FiltersChipsProps>;
	providerProps: Partial<FiltersProviderProps>;
}> = ({ props = {}, providerProps = {} }) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider
			containerRef={containerRef}
			defaultFilters={[numberFilter]}
			fields={[numberField]}
			{...providerProps}
		>
			<Flex ref={containerRef}>
				<FiltersChips {...props} />
			</Flex>
		</FilterProvider>
	);
};

const renderComponent = (props: Partial<FiltersChipsProps> = {}, providerProps: Partial<FiltersProviderProps> = {}) =>
	renderWithMockedStore(<FakeComponent props={props} providerProps={providerProps} />);

describe('NumberFilter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct text for equal condition', () => {
		const filter = getFilter({ condition: 'equal' });

		expect(filter.renderChipText()).toBe(`${numberField.text} equal ${numberFilter.value}`);
	});

	it('should return correct text for more condition', () => {
		const filter = getFilter({ condition: 'more' });

		expect(filter.renderChipText()).toBe(`${numberField.text} more than ${numberFilter.value}`);
	});

	it('should return correct text for less condition', () => {
		const filter = getFilter({ condition: 'less' });

		expect(filter.renderChipText()).toBe(`${numberField.text} less than ${numberFilter.value}`);
	});

	it('should render form', async () => {
		renderComponent();

		userEvent.click(screen.getByTestId('filtersChipsChip'));
		await waitFor(() => expect(screen.getByTestId('filtersNumberFilterValueTextField')).toBeInTheDocument());
	});
});
