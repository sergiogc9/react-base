import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Flex, Select } from '@sergiogc9/react-ui';
import { Form } from '@sergiogc9/react-ui-form';

import i18n from 'i18n';

import { FilterDate, FilterFieldDate } from '../../../types';
import { FiltersFactoryFormProps } from '../../types';
import BaseFilter from '../BaseFilter';

export const DATE_FILTER_VALUES = ['today', 'yesterday', 'last_week', 'last_two_weeks'] as const;

const DateFilterForm: React.FC<FiltersFactoryFormProps<FilterDate, FilterFieldDate>> = props => {
	const { children, defaultValues, onSubmit } = props;

	const { t } = useTranslation();

	const validationSchema = React.useMemo(
		() =>
			Yup.object({
				value: Yup.string().oneOf(DATE_FILTER_VALUES).required(t('form.error.input_required'))
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
						data-testid="filtersDateFilterValueSelect"
						label={t('filters.filter.date.label.value')}
						name="value"
					>
						{DATE_FILTER_VALUES.map(option => (
							<Select.Option id={option} key={option}>
								{t(`filters.filter.date.options.${option}`)}
							</Select.Option>
						))}
					</Form.Select>
				</Flex>
				{children}
			</Flex>
		</Form>
	);
};

class DateFilter extends BaseFilter {
	public Form = DateFilterForm;

	public getDefaultFilterData(field: FilterFieldDate) {
		const defaultFilter: FilterDate = {
			field: field.field,
			id: this._generateId('date'),
			value: field.defaultValue ?? 'today',
			type: 'date'
		};
		return defaultFilter;
	}

	public renderChipText() {
		const { value } = this._filter as FilterDate;
		const { text: fieldText } = this._field;

		return `${fieldText}: ${i18n.t(`filters.filter.date.options.${value}`)}`;
	}
}

export default DateFilter;
