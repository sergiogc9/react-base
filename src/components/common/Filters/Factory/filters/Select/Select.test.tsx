import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Box } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';

import { Filter, FilterField, FilterSelect, FilterFieldSelect } from '../../../types';
import FiltersChips, { FiltersChipsProps } from '../../../Chips';
import FilterProvider, { FiltersProviderProps } from '../../../Provider';
import FiltersFactory from '../../FiltersFactory';

const SelectFilter: Filter = {
	field: 'fake_text',
	id: 'fake-id',
	type: 'select',
	value: '10'
};
const options = [
	{ label: 'Option 1', value: SelectFilter.value },
	{ label: 'Option 2', value: 'fake_option_2' }
];
const SelectField: FilterField = {
	field: SelectFilter.field,
	options,
	text: 'Fake',
	type: SelectFilter.type
};

const getFilter = (filterData: Partial<FilterSelect> = {}, fieldData: Partial<FilterFieldSelect> = {}) => {
	return FiltersFactory.getFilter({ ...SelectFilter, ...filterData }, [{ ...SelectField, ...fieldData }]);
};

const FakeComponent: React.FC<{
	props: Partial<FiltersChipsProps>;
	providerProps: Partial<FiltersProviderProps>;
}> = ({ props = {}, providerProps = {} }) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider
			containerRef={containerRef}
			defaultFilters={[SelectFilter]}
			fields={[SelectField]}
			{...providerProps}
		>
			<Box ref={containerRef}>
				<FiltersChips {...props} />
			</Box>
		</FilterProvider>
	);
};

const renderComponent = (props: Partial<FiltersChipsProps> = {}, providerProps: Partial<FiltersProviderProps> = {}) =>
	renderWithMockedStore(<FakeComponent props={props} providerProps={providerProps} />);

describe('SelectFilter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct text', () => {
		const filter = getFilter();

		expect(filter.renderChipText()).toBe(`${SelectField.text}: ${options[0].label}`);
	});

	it('should render form', async () => {
		renderComponent();

		userEvent.click(screen.getByTestId('filtersChipsChip'));
		await waitFor(() => expect(screen.getByTestId('filtersSelectFilterValueSelect')).toBeInTheDocument());
	});
});
