import React from 'react';
import { DatePicker } from 'react-md/lib/Pickers';
import moment from 'moment';

import { withT } from '@src/lib/i18n';
import { DateFieldElement } from '@src/types/form';
import { formFieldBaseValidation } from '@src/components/common/Form/Form';
import { useForceFieldValue } from '@src/lib/hooks';
import { ComponentProps } from './types';

import './FormDateField.scss';

const __validateDateField = (element: DateFieldElement, newValue: Date) => {
	if (!formFieldBaseValidation(element, newValue)) return false;
	if (!element.validations) return true;
	return true;
};

const FormDateField = (props: ComponentProps) => {
	const { t, element, forceValue, error, onChangeDate } = props;

	const [date, setDate] = React.useState(element.defaultValue || new Date());
	useForceFieldValue(forceValue, null, element, setDate, onChangeDate, __validateDateField);

	const handleDateChange = React.useCallback((formattedDate, rawDate, ev) => {
		setDate(rawDate);

		const parsedDate = moment.tz(moment(rawDate).format('YYYY-MM-DD'), 'UTC').toDate();
		onChangeDate(element.id, parsedDate, __validateDateField(element, parsedDate));
	}, [element, onChangeDate]);

	return (
		<div className='react-base-form-date-field' >
			<DatePicker
				id={`formDateField-${element.id}`}
				label={t("insert_article.modal.form.date")}
				okLabel={t('filters.period.custom.dialog.ok')}
				cancelLabel={t('filters.period.custom.dialog.cancel')}
				icon={null}
				value={date}
				minDate={element.minDate}
				maxDate={element.maxDate}
				onChange={handleDateChange}
				required={element.required}
				error={error}
				disabled={element.disabled}
				{...element.inputProps}
			/>
		</div>
	);
};

export default withT(React.memo(FormDateField));
