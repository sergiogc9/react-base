import React from 'react';

import { FilterDate } from '../../../';
import BaseFilter from '../BaseFilter';

export const DATE_FILTER_CONDITIONS = ['after_date', 'before_date', 'between_dates'] as const;

class DateFilter extends BaseFilter {
	public Form = () => {
		return <div>DATE FORM</div>;
	};

	public getDefaultFilterData(field: string) {
		const defaultFilter: FilterDate = {
			condition: 'after_date',
			field,
			id: this._generateId('date'),
			value: new Date(),
			type: 'date'
		};
		return defaultFilter;
	}

	public renderChipText() {
		return 'Date chip';
	}
}

export default DateFilter;
