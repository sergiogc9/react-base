import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flex } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';
import locales from 'i18n/locales/en.json';

import { Filter, FilterField, FilterBoolean, FilterFieldBoolean } from '../../../types';
import FiltersChips, { FiltersChipsProps } from '../../../Chips';
import FilterProvider, { FiltersProviderProps } from '../../../Provider';
import FiltersFactory from '../../FiltersFactory';

const booleanFilter: Filter = { field: 'fake', id: 'fake-id', type: 'boolean', value: true };
const booleanField: FilterField = { field: booleanFilter.field, text: 'Fake', type: booleanFilter.type };

const getFilter = (filterData: Partial<FilterBoolean> = {}, fieldData: Partial<FilterFieldBoolean> = {}) => {
	return FiltersFactory.getFilter({ ...booleanFilter, ...filterData }, [{ ...booleanField, ...fieldData }]);
};

const FakeComponent: React.FC<{
	props: Partial<FiltersChipsProps>;
	providerProps: Partial<FiltersProviderProps>;
}> = ({ props = {}, providerProps = {} }) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider
			containerRef={containerRef}
			defaultFilters={[booleanFilter]}
			fields={[booleanField]}
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

describe('BooleanFilter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct text for true value', () => {
		const filter = getFilter({ value: true });

		expect(filter.renderChipText()).toBe(`${booleanField.text}: Yes`);
	});

	it('should return correct text for false value', () => {
		const filter = getFilter({ value: false });

		expect(filter.renderChipText()).toBe(`${booleanField.text}: No`);
	});

	it('should render form', async () => {
		renderComponent();

		userEvent.click(screen.getByTestId('filtersChipsChip'));
		await waitFor(() => expect(screen.getByTestId('filtersBooleanFilterValueSelect')).toBeInTheDocument());
	});

	it('should submit button be clickable at first', async () => {
		renderComponent({}, { defaultFilters: [{ ...booleanFilter, value: false }] });

		userEvent.click(screen.getByTestId('filtersChipsChip'));
		await waitFor(() => expect(screen.getByText(locales.form.buttons.save).closest('button')).toBeEnabled());

		userEvent.click(screen.getByText(locales.form.buttons.save));

		await waitFor(() => expect(screen.queryByText(locales.form.buttons.save)).toBeNull());
	});
});
