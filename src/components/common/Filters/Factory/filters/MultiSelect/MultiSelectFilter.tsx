import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Flex, Select } from '@sergiogc9/react-ui';
import { Form } from '@sergiogc9/react-ui-form';

import i18n from 'i18n';

import { FilterMultiSelect, FilterFieldMultiSelect } from '../../../types';
import { FiltersFactoryFormProps } from '../../types';
import BaseFilter from '../BaseFilter';

export const MULTI_SELECT_FILTER_CONDITIONS = ['any_of', 'not_any_of'] as const;

const MultiSelectFilterForm: React.FC<FiltersFactoryFormProps<FilterMultiSelect, FilterFieldMultiSelect>> = props => {
	const { children, defaultValues, field, onSubmit } = props;

	const { t } = useTranslation();

	const validationSchema = React.useMemo(
		() =>
			Yup.object({
				condition: Yup.string().oneOf(MULTI_SELECT_FILTER_CONDITIONS).required(),
				value: Yup.array<string>().required(t('form.error.input_required')!)
			}),
		[t]
	);

	return (
		<Form
			defaultValues={defaultValues}
			height="100%"
			onSubmit={onSubmit}
			useFormProps={{ mode: 'onChange' }}
			validationSchema={validationSchema}
		>
			<Flex flexDirection="column" height="100%" justifyContent="space-between">
				<Flex flexDirection="column" gap={4}>
					<Form.Select label={t('filters.filter.common.label.condition')!} name="condition">
						{MULTI_SELECT_FILTER_CONDITIONS.map(condition => (
							<Select.Option id={condition} key={condition}>
								{t(`filters.filter.multi_select.condition.${condition}`)}
							</Select.Option>
						))}
					</Form.Select>
					<Form.Select
						data-testid="filtersMultiSelectFilterValueSelect"
						isMultiSelect
						label={t('filters.filter.multi_select.label.value')!}
						name="value"
					>
						{field.options.map(options => (
							<Select.Option id={options.value} key={options.value}>
								{options.label}
							</Select.Option>
						))}
					</Form.Select>
				</Flex>
				{children}
			</Flex>
		</Form>
	);
};

class MultiSelectFilter extends BaseFilter {
	public Form = MultiSelectFilterForm;

	public getDefaultFilterData(field: FilterFieldMultiSelect) {
		const defaultFilter: FilterMultiSelect = {
			condition: 'any_of',
			field: field.field,
			id: this._generateId('multi_select'),
			value: field.defaultValue ?? [],
			type: 'multi_select'
		};
		return defaultFilter;
	}

	public renderChipText() {
		const { condition, value } = this._filter as FilterMultiSelect;
		const { options, text: fieldText } = this._field as FilterFieldMultiSelect;

		const formattedValue = value.map(id => options.find(option => option.value === id)?.label).join(', ');

		if (condition === 'any_of')
			return i18n.t('filters.filter.multi_select.chip.any_of', { field: fieldText, value: formattedValue });
		return i18n.t('filters.filter.multi_select.chip.not_any_of', { field: fieldText, value: formattedValue });
	}
}

export default MultiSelectFilter;
