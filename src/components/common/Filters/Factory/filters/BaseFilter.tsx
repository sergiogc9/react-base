import { Filter, FilterField } from '../../types';
import { FiltersFactoryFormProps } from '../types';

const isFilter = (filter: Filter | FilterField): filter is Filter => {
	return (filter as Filter).value !== undefined;
};

abstract class BaseFilter {
	protected _filter: Filter;
	protected _field: FilterField;

	public constructor(filter: Filter | FilterField, fields: FilterField[]) {
		if (isFilter(filter)) {
			this._filter = filter;
			this._field = fields.find(({ field }) => field === filter.field)!;
		} else {
			this._filter = this.getDefaultFilterData(filter);
			this._field = filter;
		}
	}

	public abstract getDefaultFilterData(field: FilterField): Filter;

	public getFilterData(): Filter {
		return this._filter;
	}

	public abstract renderChipText(): string;

	public abstract Form: React.FC<FiltersFactoryFormProps<any, any>>;

	protected _generateId(type: Filter['type']) {
		return `${type}-${new Date().getTime()}-${Math.floor(Math.random() * 100000000)}`;
	}
}

export default BaseFilter;
