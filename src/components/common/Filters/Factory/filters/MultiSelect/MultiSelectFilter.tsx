import React from 'react';

import { FilterMultiSelect } from '../../../types';
import BaseFilter from '../BaseFilter';

export const MULTI_SELECT_FILTER_CONDITIONS = ['any_of', 'not_any_of'] as const;

class MultiSelectFilter extends BaseFilter {
	public Form = () => {
		return <div>MULTI SELECT FORM</div>;
	};

	public getDefaultFilterData(field: string) {
		const defaultFilter: FilterMultiSelect = {
			condition: 'any_of',
			field,
			id: this._generateId('multi_select'),
			options: [],
			value: [],
			type: 'multi_select'
		};
		return defaultFilter;
	}

	public renderChipText() {
		return 'Multi select chip';
	}
}

export default MultiSelectFilter;
