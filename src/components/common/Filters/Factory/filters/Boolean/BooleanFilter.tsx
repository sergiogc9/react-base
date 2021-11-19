import React from 'react';

import { FilterBoolean } from '../../../types';
import BaseFilter from '../BaseFilter';

class BooleanFilter extends BaseFilter {
	public Form = () => {
		return <div>BOOLEAN FORM</div>;
	};

	public getDefaultFilterData(field: string) {
		const defaultFilter: FilterBoolean = {
			field,
			id: this._generateId('boolean'),
			value: true,
			type: 'boolean'
		};
		return defaultFilter;
	}

	public renderChipText() {
		return 'Boolean Chip';
	}
}

export default BooleanFilter;
