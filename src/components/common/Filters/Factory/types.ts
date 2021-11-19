import { Filter } from '../types';

export type FiltersFactoryFormProps<T extends Filter> = {
	readonly defaultValues: Omit<T, 'field' | 'id' | 'type'>;
	readonly filter: T;
	readonly onSubmit: (filterData: Omit<T, 'field' | 'id' | 'type'>) => void;
};
