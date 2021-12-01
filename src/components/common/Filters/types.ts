import { DATE_FILTER_VALUES } from './Factory/filters/Date';
import { MULTI_SELECT_FILTER_CONDITIONS } from './Factory/filters/MultiSelect';
import { NUMBER_FILTER_CONDITIONS } from './Factory/filters/Number';
import { TEXT_FILTER_CONDITIONS } from './Factory/filters/Text';

type FilterFieldBase = {
	field: string;
	text: string;
};

type FilterFieldOption = { label: string; value: string };

export type FilterField =
	| FilterFieldBoolean
	| FilterFieldDate
	| FilterFieldSelect
	| FilterFieldMultiSelect
	| FilterFieldNumber
	| FilterFieldText;

export type FilterType =
	| FilterBoolean['type']
	| FilterDate['type']
	| FilterMultiSelect['type']
	| FilterNumber['type']
	| FilterText['type'];

export type Filter = FilterBoolean | FilterDate | FilterSelect | FilterMultiSelect | FilterNumber | FilterText;

export type FilterBoolean = { field: string; id: string; type: 'boolean'; value: boolean };
export type FilterFieldBoolean = FilterFieldBase & { defaultValue?: boolean; type: FilterBoolean['type'] };

export type FilterDate = {
	field: string;
	id: string;
	type: 'date';
	value: typeof DATE_FILTER_VALUES[number];
};
export type FilterFieldDate = FilterFieldBase & {
	defaultValue?: typeof DATE_FILTER_VALUES[number];
	type: FilterDate['type'];
};

export type FilterSelect = {
	field: string;
	id: string;
	type: 'select';
	value: string;
};
export type FilterFieldSelect = FilterFieldBase & {
	defaultValue?: string;
	options: FilterFieldOption[];
	type: FilterSelect['type'];
};

export type FilterMultiSelect = {
	condition: typeof MULTI_SELECT_FILTER_CONDITIONS[number];
	field: string;
	id: string;
	type: 'multi_select';
	value: string[];
};
export type FilterFieldMultiSelect = FilterFieldBase & {
	defaultValue?: string[];
	options: FilterFieldOption[];
	type: FilterMultiSelect['type'];
};

export type FilterNumber = {
	condition: typeof NUMBER_FILTER_CONDITIONS[number];
	field: string;
	id: string;
	type: 'number';
	value: number;
};
export type FilterFieldNumber = FilterFieldBase & { defaultValue?: number; type: FilterNumber['type'] };

export type FilterText = {
	condition: typeof TEXT_FILTER_CONDITIONS[number];
	field: string;
	id: string;
	type: 'text';
	value: string;
};
export type FilterFieldText = FilterFieldBase & { defaultValue?: string; type: FilterText['type'] };
