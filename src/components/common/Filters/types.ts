import { DATE_FILTER_CONDITIONS } from './Factory/filters/Date';
import { MULTI_SELECT_FILTER_CONDITIONS } from './Factory/filters/MultiSelect';
import { NUMBER_FILTER_CONDITIONS } from './Factory/filters/Number';
import { TEXT_FILTER_CONDITIONS } from './Factory/filters/Text';

export type FilterField = { field: string; text: string; type: FilterType };

export type FilterType =
	| FilterBoolean['type']
	| FilterDate['type']
	| FilterMultiSelect['type']
	| FilterNumber['type']
	| FilterText['type'];

export type Filter = FilterBoolean | FilterDate | FilterMultiSelect | FilterNumber | FilterText;

export type FilterBoolean = { field: string; id: string; type: 'boolean'; value: boolean };

export type FilterDate = {
	condition: typeof DATE_FILTER_CONDITIONS[number];
	field: string;
	id: string;
	type: 'date';
	value: Date | Date[];
};

export type FilterMultiSelect = {
	condition: typeof MULTI_SELECT_FILTER_CONDITIONS[number];
	field: string;
	id: string;
	options: { label: string; value: string }[];
	type: 'multi_select';
	value: string[];
};

export type FilterNumber = {
	condition: typeof NUMBER_FILTER_CONDITIONS[number];
	field: string;
	id: string;
	type: 'number';
	value: number;
};

export type FilterText = {
	condition: typeof TEXT_FILTER_CONDITIONS[number];
	field: string;
	id: string;
	type: 'text';
	value: string;
};
