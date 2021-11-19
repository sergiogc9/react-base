import React from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Box, Select } from '@sergiogc9/react-ui';

import Form from 'components/common/Form';

import { FilterText } from '../../..';
import { FiltersFactoryFormProps } from '../../types';
import BaseFilter from '../BaseFilter';

export const TEXT_FILTER_CONDITIONS = ['contains', 'not_contains'] as const;

const TextFilterForm: React.FC<FiltersFactoryFormProps<FilterText>> = props => {
	const { children, defaultValues, onSubmit } = props;

	const { t } = useTranslation();

	const validationSchema = React.useMemo(
		() =>
			Yup.object({
				condition: Yup.string().oneOf(TEXT_FILTER_CONDITIONS).required(),
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
			<Box flexDirection="column" height="100%" justifyContent="space-between">
				<Box flexDirection="column" gap={4}>
					<Form.Select label={t('filters.filter.common.label.condition')} name="condition">
						{TEXT_FILTER_CONDITIONS.map(condition => (
							<Select.Option id={condition} key={condition}>
								{t(`filters.filter.text.condition.${condition}`)}
							</Select.Option>
						))}
					</Form.Select>
					<Form.TextField
						data-testid="filtersTextFilterValueTextField"
						label={t('filters.filter.text.label.value')}
						maxLength={30}
						name="value"
					/>
				</Box>
				{children}
			</Box>
		</Form>
	);
};

class TextFilter extends BaseFilter {
	public Form = TextFilterForm;

	public getDefaultFilterData(field: string) {
		const defaultFilter: FilterText = {
			condition: 'contains',
			field,
			id: this._generateId('text'),
			value: '',
			type: 'text'
		};
		return defaultFilter;
	}

	public renderChipText() {
		const { field, value } = this._filter as FilterText;
		return `${field}: ${value}`;
	}
}

export default TextFilter;
