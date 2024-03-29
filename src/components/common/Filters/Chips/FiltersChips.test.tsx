import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Flex } from '@sergiogc9/react-ui';

import TestUtils from 'lib/tests';
import { renderWithMockedStore } from 'lib/tests/redux';
import locales from 'i18n/locales/en.json';

import FilterProvider, { FiltersProviderProps } from '../Provider';
import { Filter, FilterField } from '..';
import FiltersChips from '.';
import { FiltersChipsProps } from './types';

const textFilter: Filter = { condition: 'contains', field: 'fake_text', id: 'fake-id', type: 'text', value: 'Awesome' };
const numberFilter: Filter = {
	condition: 'more',
	field: 'fake_number',
	id: 'fake-id-number',
	type: 'number',
	value: 10
};

const numberField: FilterField = { field: numberFilter.field, text: 'Number Fake', type: numberFilter.type };
const textField: FilterField = { field: textFilter.field, text: 'Fake', type: textFilter.type };

const FakeComponent: React.FC<{ props: Partial<FiltersChipsProps>; providerProps: Partial<FiltersProviderProps> }> = ({
	props = {},
	providerProps = {}
}) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider
			containerRef={containerRef}
			defaultFilters={[textFilter, numberFilter]}
			fields={[textField, numberField]}
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

describe('FiltersChips', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		TestUtils.useAnimationsInTests();
	});

	it('should render filters chips and clear button if there are filters', () => {
		renderComponent();

		expect(screen.getAllByTestId('filtersChipsChip')).toHaveLength(2);
		expect(screen.getByTestId('filtersChipsClearAllBtn')).toBeInTheDocument();
	});

	it('should not render filters chips and clear button if there are no filters', () => {
		renderComponent({}, { defaultFilters: [] });

		expect(screen.queryByTestId('filtersChipsChip')).toBeNull();
		expect(screen.queryByTestId('filtersChipsClearAllBtn')).toBeNull();
	});

	it('should render filters chips texts', () => {
		renderComponent();

		expect(screen.getByText(`${textField.text} contains ${textFilter.value}`)).toBeInTheDocument();
		expect(screen.getByText(`${numberField.text} more than ${numberFilter.value}`)).toBeInTheDocument();
	});

	it('should clear all filters', () => {
		renderComponent({}, { defaultFilters: [textFilter, numberFilter] });

		userEvent.click(screen.getByTestId('filtersChipsClearAllBtn'));

		fireEvent.animationEnd(screen.getAllByTestId('filtersChipsChipAnimatedWrapper')[0]);
		fireEvent.animationEnd(screen.getByTestId('filtersChipsAnimationWrapper'));

		expect(screen.queryByTestId('filtersChipsChip')).toBeNull();
		expect(screen.queryByTestId('filtersChipsClearAllBtn')).toBeNull();
	});

	it('should remove a filter', () => {
		renderComponent({}, { defaultFilters: [textFilter, numberFilter] });

		userEvent.click(screen.queryAllByTestId('filtersChipsChip')[0].querySelector('svg')!);

		fireEvent.animationEnd(screen.queryAllByTestId('filtersChipsChipAnimatedWrapper')[0]);

		expect(screen.queryAllByTestId('filtersChipsChip')).toHaveLength(1);
		expect(screen.queryByTestId('filtersChipsClearAllBtn')).toBeInTheDocument();
	});

	it("should show and hide the popover when clicking the chip's overlay", async () => {
		renderComponent();

		const chip = screen.getAllByTestId('filtersChipsChip')[0];
		expect(chip.querySelector('.overlay')).toBeInTheDocument();

		userEvent.hover(chip);
		const chipOverlay = chip.querySelector('.overlay');

		userEvent.click(chipOverlay!);

		expect(screen.getByTestId('filtersPopover')).toBeInTheDocument();

		await waitFor(() => expect(screen.getByText(locales.form.buttons.cancel)).toBeInTheDocument());
		userEvent.click(chip);

		await waitFor(() => expect(screen.queryByTestId('filtersPopover')).toBeNull());
	});
});
