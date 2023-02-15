import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flex } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';

import { Filter, FilterField, FilterMultiSelect, FilterFieldMultiSelect } from '../../../types';
import FiltersChips, { FiltersChipsProps } from '../../../Chips';
import FilterProvider, { FiltersProviderProps } from '../../../Provider';
import FiltersFactory from '../../FiltersFactory';

const multiSelectFilter: Filter = {
	condition: 'any_of',
	field: 'fake_text',
	id: 'fake-id',
	type: 'multi_select',
	value: ['10', '20']
};
const options = [
	{ label: 'Option 1', value: multiSelectFilter.value[0] },
	{ label: 'Option 2', value: multiSelectFilter.value[1] }
];
const multiSelectField: FilterField = {
	field: multiSelectFilter.field,
	options,
	text: 'Fake',
	type: multiSelectFilter.type
};

const getFilter = (filterData: Partial<FilterMultiSelect> = {}, fieldData: Partial<FilterFieldMultiSelect> = {}) => {
	return FiltersFactory.getFilter({ ...multiSelectFilter, ...filterData }, [{ ...multiSelectField, ...fieldData }]);
};

const FakeComponent: React.FC<{
	props: Partial<FiltersChipsProps>;
	providerProps: Partial<FiltersProviderProps>;
}> = ({ props = {}, providerProps = {} }) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider
			containerRef={containerRef}
			defaultFilters={[multiSelectFilter]}
			fields={[multiSelectField]}
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

describe('MultiSelectFilter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct text for any of condition', () => {
		const filter = getFilter({ condition: 'any_of' });

		expect(filter.renderChipText()).toBe(`${multiSelectField.text} any of ${options[0].label}, ${options[1].label}`);
	});

	it('should return correct text for not any of condition', () => {
		const filter = getFilter({ condition: 'not_any_of' });

		expect(filter.renderChipText()).toBe(
			`${multiSelectField.text} not any of ${options[0].label}, ${options[1].label}`
		);
	});

	it('should render form', async () => {
		renderComponent();

		userEvent.click(screen.getByTestId('filtersChipsChip'));
		await waitFor(() => expect(screen.getByTestId('filtersMultiSelectFilterValueSelect')).toBeInTheDocument());
	});
});
