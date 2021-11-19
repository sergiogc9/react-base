import { Filter, FilterField } from '../types';

type Props = {
	readonly containerRef: React.RefObject<HTMLElement>;
	readonly defaultFilters?: Filter[];
	readonly fields: FilterField[];
	readonly onFiltersChange?: (filters: Filter[]) => void;
};

export type FiltersProviderProps = Props;
