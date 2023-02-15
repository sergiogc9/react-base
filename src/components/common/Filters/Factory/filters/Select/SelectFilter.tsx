import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Flex, Select } from '@sergiogc9/react-ui';
import { Form } from '@sergiogc9/react-ui-form';

import { FilterSelect, FilterFieldSelect } from '../../../types';
import { FiltersFactoryFormProps } from '../../types';
import BaseFilter from '../BaseFilter';

const SelectFilterForm: React.FC<FiltersFactoryFormProps<FilterSelect, FilterFieldSelect>> = props => {
	const { children, defaultValues, field, onSubmit } = props;

	const { t } = useTranslation();

	const validationSchema = React.useMemo(
		() =>
			Yup.object({
				value: Yup.string().required(t('form.error.input_required'))
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
					<Form.Select
						data-testid="filtersSelectFilterValueSelect"
						label={t('filters.filter.multi_select.label.value')}
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

class SelectFilter extends BaseFilter {
	public Form = SelectFilterForm;

	public getDefaultFilterData(field: FilterFieldSelect) {
		const defaultFilter: FilterSelect = {
			field: field.field,
			id: this._generateId('select'),
			value: field.defaultValue || '',
			type: 'select'
		};
		return defaultFilter;
	}

	public renderChipText() {
		const { value } = this._filter as FilterSelect;
		const { options, text: fieldText } = this._field as FilterFieldSelect;

		const formattedValue = options.find(option => option.value === value)?.label;

		return `${fieldText}: ${formattedValue}`;
	}
}

export default SelectFilter;
