import React from 'react';
import TextField from 'react-md/lib/TextFields';
import get from 'lodash/get';
import has from 'lodash/has';
import isURL from 'validator/lib/isURL';

import { withT, TProps } from '@src/lib/i18n';
import { TextFieldElement } from '@src/types/form';
import { formFieldBaseValidation } from '@src/components/common/Form/Form';
import { useForceFieldValue } from '@src/lib/hooks';

import './FormTextField.scss';

export type ComponentProps = TProps & {
	element: TextFieldElement,
	forceValue?: string,
	error: boolean,
	onChangeText: (elementId: string, text: string, isValid: boolean) => void
};

const __validateTextField = (element: TextFieldElement, newValue: string) => {
	if (!formFieldBaseValidation(element, newValue)) return false;
	if (!element.validations) return true;
	if (element.validations.maxLength && element.validations.maxLength < newValue.length) return false;
	if (element.validations.minLength && element.validations.minLength > newValue.length) return false;
	if (element.validations.url && !isURL(newValue)) return false;
	return true;
};

const FormTextField = (props: ComponentProps) => {
	const { t, element, forceValue, error, onChangeText } = props;

	const [value, setValue] = React.useState(element.defaultValue || "");
	useForceFieldValue(forceValue, null, element, setValue, onChangeText, __validateTextField);

	const __onChangeHandler = React.useCallback((text: React.ReactText) => setValue(text.toString()), []);
	const __onBlurHandler = React.useCallback(
		(ev: any) => onChangeText(element.id, ev.target.value.trim(), __validateTextField(element, ev.target.value.trim())),
		[element, onChangeText]
	);

	return <TextField
		type="text"
		id={`formTextField-${element.id}`}
		className={`react-base-form-text-field ${element.className || ""}`}
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

export default withT(React.memo(FormTextField));
