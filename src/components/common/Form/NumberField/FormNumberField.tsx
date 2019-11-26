import React from 'react';
import TextField from 'react-md/lib/TextFields';
import get from 'lodash/get';
import has from 'lodash/has';

import { withT, TProps } from '@src/lib/i18n';
import { NumberFieldElement } from '@src/types/form';
import { formFieldBaseValidation } from '@src/components/common/Form/Form';
import { useForceFieldValue } from '@src/lib/hooks';

import './FormNumberField.scss';

export type ComponentProps = TProps & {
	element: NumberFieldElement,
	forceValue?: number,
	error: boolean,
	onChangeNumber: (elementId: string, num: number, isValid: boolean) => void
};

const __validateNumberField = (element: NumberFieldElement, newValue: number) => {
	if (!formFieldBaseValidation(element, newValue)) return false;
	if (!element.validations) return true;
	if (element.validations.max && element.validations.max < newValue) return false;
	if (element.validations.min && element.validations.min > newValue) return false;
	return true;
};

const FormNumberField = (props: ComponentProps) => {
	const { t, element, forceValue, error, onChangeNumber } = props;

	const [value, setValue] = React.useState(element.defaultValue || "");
	useForceFieldValue(forceValue, null, element, setValue, onChangeNumber, __validateNumberField);

	const __onChangeHandler = React.useCallback((val: React.ReactText) => setValue(parseFloat(val.toString())), []);
	const __onBlurHandler = React.useCallback(
		(ev: any) => onChangeNumber(element.id, parseFloat(ev.target.value), __validateNumberField(element, parseFloat(ev.target.value))),
		[element, onChangeNumber]
	);

	return <TextField
		type="number"
		id={`formNumberField-${element.id}`}
		className={`discover-form-number-field ${element.className || ""}`}
		label={has(element, 'label.key') ? t(get(element, 'label.key')) : element.label}
		value={value}
		onChange={__onChangeHandler}
		onBlur={__onBlurHandler}
		required={!!element.required}
		error={error}
		disabled={element.disabled}
		{...element.inputProps}
	/>;
};

export default withT(React.memo(FormNumberField));
