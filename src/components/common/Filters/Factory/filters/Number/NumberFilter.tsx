import React from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Box, Select } from '@sergiogc9/react-ui';

import Form from 'components/common/Form';

import { FilterNumber } from '../../../';
import { FiltersFactoryFormProps } from '../../types';
import BaseFilter from '../BaseFilter';

export const NUMBER_FILTER_CONDITIONS = ['equal', 'less', 'more'] as const;

const NumberFilterForm: React.FC<FiltersFactoryFormProps<FilterNumber>> = props => {
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
			<Box flexDirection="column" height="100%" justifyContent="space-between">
				<Box flexDirection="column" gap={4}>
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
				</Box>
				{children}
			</Box>
		</Form>
	);
};

class NumberFilter extends BaseFilter {
	public Form = NumberFilterForm;

	public getDefaultFilterData(field: string) {
		const defaultFilter: FilterNumber = {
			condition: 'more',
			field,
			id: this._generateId('number'),
			value: 0,
			type: 'number'
		};
		return defaultFilter;
	}

	public renderChipText() {
		const { field, value } = this._filter as FilterNumber;
		return `${field}: ${value}`;
	}
}

export default NumberFilter;
