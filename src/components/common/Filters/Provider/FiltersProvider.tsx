import React from 'react';
import { findIndex, reject } from 'lib/imports/lodash';
import { useUpdateEffect } from '@sergiogc9/react-hooks';

import FiltersContext, { FiltersContextData } from '../Context';
import { Filter } from '..';
import { FiltersProviderProps } from './types';

const FiltersProvider: React.FC<FiltersProviderProps> = props => {
	const { children, containerRef, defaultFilters = [], fields, onFiltersChange } = props;

	const [filters, setFilters] = React.useState<Filter[]>(defaultFilters);

	useUpdateEffect(() => {
		if (onFiltersChange) onFiltersChange(filters);
	}, [filters]);

	const addFilter = React.useCallback((filter: Filter) => {
		setFilters(currentFilters => [filter, ...currentFilters]);
	}, []);

	const clearAllFilters = React.useCallback(() => {
		setFilters([]);
	}, []);

	const removeFilter = React.useCallback((filter: Filter) => {
		setFilters(currentFilters => reject(currentFilters, { id: filter.id }));
	}, []);

	const updateFilter = React.useCallback((filter: Filter) => {
		setFilters(currentFilters => {
			const newArray = [...currentFilters];
			const filterIndex = findIndex(newArray, f => f.id === filter.id);
			newArray[filterIndex] = filter;
			return newArray;
		});
	}, []);

	const contextData = React.useMemo<FiltersContextData>(
		() => ({
			addFilter,
			clearAllFilters,
			containerRef,
			filters,
			fields,
			removeFilter,
			updateFilter
		}),
		[addFilter, clearAllFilters, containerRef, fields, filters, removeFilter, updateFilter]
	);

	return <FiltersContext.Provider value={contextData}>{children}</FiltersContext.Provider>;
};

export default React.memo(FiltersProvider) as React.FC<FiltersProviderProps>;
