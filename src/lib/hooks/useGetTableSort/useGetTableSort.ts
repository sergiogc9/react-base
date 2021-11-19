import React from 'react';

import storage from 'lib/storage';

import { TableSort } from './types';

const TABLE_SORT_STORAGE_PREFIX = 'table_sort_';

const __getSortByFromStorage = (tableKey: string): TableSort => {
	return storage.get(TABLE_SORT_STORAGE_PREFIX + tableKey);
};

const useGetTableSort = (tableKey: string, defaultSort: TableSort) => {
	const [currentSort, setCurrentSort] = React.useState(__getSortByFromStorage(tableKey) ?? defaultSort);

	const onSortChange = React.useCallback(
		(id?: string, desc?: boolean) => {
			if (!id || desc === undefined) return storage.remove(TABLE_SORT_STORAGE_PREFIX + tableKey);

			const newSort: TableSort = { id, desc };
			storage.set(TABLE_SORT_STORAGE_PREFIX + tableKey, newSort);
			setCurrentSort(newSort);
		},
		[tableKey]
	);

	return { onSortChange, sortBy: currentSort };
};

export default useGetTableSort;
