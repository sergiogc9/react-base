import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Flex, Select } from '@sergiogc9/react-ui';
import { Form } from '@sergiogc9/react-ui-form';

import i18n from 'i18n';

import { FilterBoolean, FilterFieldBoolean } from '../../../types';
import { FiltersFactoryFormProps } from '../../types';
import BaseFilter from '../BaseFilter';

const SelectFilterForm: React.FC<FiltersFactoryFormProps<FilterBoolean, FilterFieldBoolean>> = props => {
	const { children, defaultValues, onSubmit } = props;

	const { t } = useTranslation();

	const validationSchema = React.useMemo(
		() =>
			Yup.object({
				value: Yup.string().required(t('form.error.input_required'))
			}),
		[t]
	);

	const onFormattedSubmit = React.useCallback(
		(data: any) => {
			onSubmit({ ...data, value: data.value === 'yes' });
		},
		[onSubmit]
	);

	const formattedDefaultValues = React.useMemo(() => {
		return { ...defaultValues, value: defaultValues.value ? 'yes' : 'no' };
	}, [defaultValues]);

	return (
		<Form
			defaultValues={formattedDefaultValues}
			height="100%"
			onSubmit={onFormattedSubmit}
			useFormProps={{ mode: 'onChange' }}
			validationSchema={validationSchema}
		>
			<Flex flexDirection="column" height="100%" justifyContent="space-between">
				<Flex flexDirection="column" gap={4}>
					<Form.Select
						data-testid="filtersBooleanFilterValueSelect"
						label={t('filters.filter.boolean.label.value')}
						name="value"
					>
						<Select.Option id="yes" key="yes">
							{t('general.yes')}
						</Select.Option>
						<Select.Option id="no" key="no">
							{t('general.no')}
						</Select.Option>
					</Form.Select>
				</Flex>
				{children}
			</Flex>
		</Form>
	);
};

class BooleanFilter extends BaseFilter {
	public Form = SelectFilterForm;

	public getDefaultFilterData(field: FilterFieldBoolean) {
		const defaultFilter: FilterBoolean = {
			field: field.field,
			id: this._generateId('boolean'),
			value: field.defaultValue ?? true,
			type: 'boolean'
		};
		return defaultFilter;
	}

	public renderChipText() {
		const { value } = this._filter as FilterBoolean;
		const { text: fieldText } = this._field as FilterFieldBoolean;

		const formattedValue = value ? i18n.t('general.yes') : i18n.t('general.no');

		return `${fieldText}: ${formattedValue}`;
	}
}

export default BooleanFilter;
