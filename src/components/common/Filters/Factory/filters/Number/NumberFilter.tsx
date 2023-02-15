import React from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Flex, Select } from '@sergiogc9/react-ui';
import { Form } from '@sergiogc9/react-ui-form';

import i18n from 'i18n';

import { FilterNumber, FilterFieldNumber } from '../../../types';
import { FiltersFactoryFormProps } from '../../types';
import BaseFilter from '../BaseFilter';

export const NUMBER_FILTER_CONDITIONS = ['equal', 'less', 'more'] as const;

const NumberFilterForm: React.FC<FiltersFactoryFormProps<FilterNumber, FilterFieldNumber>> = props => {
	const { children, defaultValues, onSubmit } = props;

	const { t } = useTranslation();

	const validationSchema = React.useMemo(
		() =>
			Yup.object({
				condition: Yup.string().oneOf(NUMBER_FILTER_CONDITIONS).required(),
				value: Yup.number().required()
			}),
		[]
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
					<Form.Select label={t('filters.filter.common.label.condition')} name="condition">
						{NUMBER_FILTER_CONDITIONS.map(condition => (
							<Select.Option id={condition} key={condition}>
								{t(`filters.filter.number.condition.${condition}`)}
							</Select.Option>
						))}
					</Form.Select>
					<Form.TextField
						data-testid="filtersNumberFilterValueTextField"
						label={t('filters.filter.number.label.value')}
						name="value"
						type="number"
					/>
				</Flex>
				{children}
			</Flex>
		</Form>
	);
};

class NumberFilter extends BaseFilter {
	public Form = NumberFilterForm;

	public getDefaultFilterData(field: FilterFieldNumber) {
		const defaultFilter: FilterNumber = {
			condition: 'more',
			field: field.field,
			id: this._generateId('number'),
			value: field.defaultValue ?? 0,
			type: 'number'
		};
		return defaultFilter;
	}

	public renderChipText() {
		const { condition, value } = this._filter as FilterNumber;
		const { text: fieldText } = this._field;

		if (condition === 'equal') return i18n.t('filters.filter.number.chip.equal', { field: fieldText, value });
		if (condition === 'more') return i18n.t('filters.filter.number.chip.more', { field: fieldText, value });
		return i18n.t('filters.filter.number.chip.less', { field: fieldText, value });
	}
}

export default NumberFilter;
