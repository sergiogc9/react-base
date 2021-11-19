import { Filter, FilterField } from '../types';
import BaseFilter from './filters/BaseFilter';
import BooleanFilter from './filters/Boolean';
import DateFilter from './filters/Date';
import MultiSelectFilter from './filters/MultiSelect';
import NumberFilter from './filters/Number';
import TextFilter from './filters/Text';

class FiltersFactory {
	public static getFilter(filter: Filter | FilterField): BaseFilter {
		// eslint-disable-next-line default-case
		switch (filter.type) {
			case 'boolean':
				return new BooleanFilter(filter);
			case 'date':
				return new DateFilter(filter);
			case 'multi_select':
				return new MultiSelectFilter(filter);
			case 'number':
				return new NumberFilter(filter);
			case 'text':
				return new TextFilter(filter);
		}
	}
}

export default FiltersFactory;
