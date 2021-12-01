import { Filter, FilterField } from '../types';
import BaseFilter from './filters/BaseFilter';
import BooleanFilter from './filters/Boolean';
import DateFilter from './filters/Date';
import MultiSelectFilter from './filters/MultiSelect';
import NumberFilter from './filters/Number';
import SelectFilter from './filters/Select';
import TextFilter from './filters/Text';

class FiltersFactory {
	public static getFilter(filter: Filter | FilterField, fields: FilterField[]): BaseFilter {
		// eslint-disable-next-line default-case
		switch (filter.type) {
			case 'boolean':
				return new BooleanFilter(filter, fields);
			case 'date':
				return new DateFilter(filter, fields);
			case 'select':
				return new SelectFilter(filter, fields);
			case 'multi_select':
				return new MultiSelectFilter(filter, fields);
			case 'number':
				return new NumberFilter(filter, fields);
			case 'text':
				return new TextFilter(filter, fields);
		}
	}
}

export default FiltersFactory;
