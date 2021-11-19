import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Box } from '@sergiogc9/react-ui';

import { renderWithMockedStore } from 'lib/tests/redux';
import locales from 'i18n/locales/en.json';

import FilterProvider, { FiltersProviderProps } from '../Provider';
import { Filter } from '..';
import FiltersChips from '.';
import { FiltersChipsProps } from './types';

const filter: Filter = { condition: 'contains', field: 'fake_text', id: 'fake-id', type: 'text', value: 'Awesome' };
const numberFilter: Filter = {
	condition: 'more',
	field: 'fake_number',
	id: 'fake-id-number',
	type: 'number',
	value: 10
};

const FakeComponent: React.FC<{ props: Partial<FiltersChipsProps>; providerProps: Partial<FiltersProviderProps> }> = ({
	props = {},
	providerProps = {}
}) => {
	const containerRef = React.useRef(null);

	return (
		<FilterProvider
			containerRef={containerRef}
			defaultFilters={[filter, numberFilter]}
			fields={[
				{ field: filter.field, text: 'Fake', type: filter.type },
				{ field: numberFilter.field, text: 'Number Fake', type: numberFilter.type }
			]}
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

describe('FiltersChips', () => {
	beforeEach(() => {
		jest.clearAllMocks();
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

	it('should clear all filters', () => {
		renderComponent({}, { defaultFilters: [filter, filter] });

		userEvent.click(screen.getByTestId('filtersChipsClearAllBtn'));

		fireEvent.animationEnd(screen.getAllByTestId('filtersChipsChipAnimatedWrapper')[0]);
		fireEvent.animationEnd(screen.getByTestId('filtersChipsAnimationWrapper'));

		expect(screen.queryByTestId('filtersChipsChip')).toBeNull();
		expect(screen.queryByTestId('filtersChipsClearAllBtn')).toBeNull();
	});

	it('should remove a filter', () => {
		renderComponent({}, { defaultFilters: [filter, filter] });

		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		userEvent.click(screen.queryAllByTestId('filtersChipsChip')[0]?.querySelector('svg')!);

		fireEvent.animationEnd(screen.queryAllByTestId('filtersChipsChipAnimatedWrapper')[0]);

		expect(screen.queryAllByTestId('filtersChipsChip')).toHaveLength(1);
		expect(screen.queryByTestId('filtersChipsClearAllBtn')).toBeInTheDocument();
	});
});
