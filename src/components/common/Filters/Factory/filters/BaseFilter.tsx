import { Filter, FilterField } from '../..';
import { FiltersFactoryFormProps } from '../types';

const isFilter = (filter: Filter | FilterField): filter is Filter => {
	return (filter as Filter).value !== undefined;
};

abstract class BaseFilter {
	protected _filter: Filter;

	public constructor(filter: Filter | FilterField) {
		this._filter = isFilter(filter) ? filter : this.getDefaultFilterData(filter.field);
	}

	public abstract getDefaultFilterData(field: string): Filter;

	public getFilterData(): Filter {
		return this._filter;
	}

	public abstract renderChipText(): string;

	public abstract Form: React.FC<FiltersFactoryFormProps<any>>;

	protected _generateId(type: Filter['type']) {
		return `${type}-${new Date().getTime()}-${Math.floor(Math.random() * 100000000)}`;
	}
}

export default BaseFilter;
