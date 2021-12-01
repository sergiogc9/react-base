import { Filter, FilterField } from '../types';

export type FiltersFactoryFormProps<T extends Filter, U extends FilterField> = {
	readonly defaultValues: Omit<T, 'field' | 'id' | 'options' | 'type'>;
	readonly field: U;
	readonly filter: T;
	readonly onSubmit: (filterData: Omit<T, 'field' | 'id' | 'options' | 'type'>) => void;
};
