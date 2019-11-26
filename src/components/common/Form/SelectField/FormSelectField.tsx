import React from 'react';
import SelectField from 'react-md/lib/SelectFields/SelectField';
import get from 'lodash/get';
import has from 'lodash/has';

import { withT, TProps } from '@src/lib/i18n';
import { SelectFieldElement } from '@src/types/form';
import { formFieldBaseValidation } from '@src/components/common/Form/Form';

import './FormSelectField.scss';
import { useForceFieldValue } from '@src/lib/hooks';

export type ComponentProps = TProps & {
	element: SelectFieldElement,
	forceValue?: string,
	error: boolean,
	onSelectOption: (elementId: string, value: string, isValid: boolean) => void
};

const __validateSelectField = (element: SelectFieldElement, newValue: string) => {
	if (!formFieldBaseValidation(element, newValue)) return false;
	if (!element.validations) return true;
	return true;
};

const FormSelectField = (props: ComponentProps) => {
	const { t, element, forceValue, error, onSelectOption } = props;

	const [value, setValue] = React.useState(element.defaultValue);
	useForceFieldValue(forceValue, null, element, setValue, onSelectOption, __validateSelectField);

	const __onChangeHandler = React.useCallback((val: string | number) => {
		setValue(val.toString());
		onSelectOption(element.id, val.toString(), __validateSelectField(element, val.toString()));
	}, [element, onSelectOption]);

	const items = React.useMemo(() => element.items.map(item => ({ label: item.label, value: item.value, key: item.value })), [element.items]);

	return <SelectField
		id={`formSelectField-${element.id}`}
		className={`discover-form-select-field ${element.className || ""}`}
		label={has(element, 'label.key') ? t(get(element, 'label.key')) : element.label}
		defaultValue={element.defaultValue}
		value={value}
		menuItems={items}
		onChange={__onChangeHandler}
		required={!!element.required}
		error={error}
		disabled={element.disabled}
		fullWidth={true}
		{...element.inputProps}
	/>;
};

export default withT(React.memo(FormSelectField));
