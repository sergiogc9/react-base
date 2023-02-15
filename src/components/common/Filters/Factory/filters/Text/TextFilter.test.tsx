import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flex } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';

import { Filter, FilterField, FilterText, FilterFieldText } from '../../../types';
import FiltersChips, { FiltersChipsProps } from '../../../Chips';
import FilterProvider, { FiltersProviderProps } from '../../../Provider';
import FiltersFactory from '../../FiltersFactory';

const textFilter: Filter = { condition: 'contains', field: 'fake_text', id: 'fake-id', type: 'text', value: 'Awesome' };
const textField: FilterField = { field: textFilter.field, text: 'Fake', type: textFilter.type };

const getFilter = (filterData: Partial<FilterText> = {}, fieldData: Partial<FilterFieldText> = {}) => {
	return FiltersFactory.getFilter({ ...textFilter, ...filterData }, [{ ...textField, ...fieldData }]);
};

const FakeComponent: React.FC<{
	props: Partial<FiltersChipsProps>;
	providerProps: Partial<FiltersProviderProps>;
}> = ({ props = {}, providerProps = {} }) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider containerRef={containerRef} defaultFilters={[textFilter]} fields={[textField]} {...providerProps}>
			<Flex ref={containerRef}>
				<FiltersChips {...props} />
			</Flex>
		</FilterProvider>
	);
};

const renderComponent = (props: Partial<FiltersChipsProps> = {}, providerProps: Partial<FiltersProviderProps> = {}) =>
	renderWithMockedStore(<FakeComponent props={props} providerProps={providerProps} />);

describe('TextFilter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct text for contains condition', () => {
		const filter = getFilter({ condition: 'contains' });

		expect(filter.renderChipText()).toBe(`${textField.text} contains ${textFilter.value}`);
	});

	it('should return correct text for not contains condition', () => {
		const filter = getFilter({ condition: 'not_contains' });

		expect(filter.renderChipText()).toBe(`${textField.text} not contains ${textFilter.value}`);
	});

	it('should render form', async () => {
		renderComponent();

		userEvent.click(screen.getByTestId('filtersChipsChip'));
		await waitFor(() => expect(screen.getByTestId('filtersTextFilterValueTextField')).toBeInTheDocument());
	});
});
