import { Filter, FilterField } from '../types';

export type FiltersContextData = {
	readonly addFilter: (filter: Filter) => void;
	readonly clearAllFilters: () => void;
	readonly containerRef: React.RefObject<HTMLElement>;
	readonly fields: FilterField[];
	readonly filters: Filter[];
	readonly removeFilter: (filter: Filter) => void;
	readonly updateFilter: (filter: Filter) => void;
};
