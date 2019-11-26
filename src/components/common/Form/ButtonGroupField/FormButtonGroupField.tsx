import React from 'react';
import { Button } from 'react-md';
import find from 'lodash/find';

import { ButtonGroupFieldElement } from '@src/types/form';
import { formFieldBaseValidation } from '@src/components/common/Form/Form';
import { useForceFieldValue } from '@src/lib/hooks';

import './FormButtonGroupField.scss';

export type ComponentProps = {
	element: ButtonGroupFieldElement,
	forceValue?: any,
	onChangeOption: (elementId: string, value: string, isValid: boolean) => void
};

const __validateButtonGroupField = (element: ButtonGroupFieldElement, newValue: any) => {
	return formFieldBaseValidation(element, newValue);
};

const FormButtonGroupField = (props: ComponentProps) => {
	const { element, forceValue } = props;
	const { onChangeOption } = props;

	const defaultOption = element.defaultValue ? find(element.options, { value: element.defaultValue }) : null;

	const [value, setValue] = React.useState(defaultOption ? defaultOption.value : element.options[0].value);
	useForceFieldValue(forceValue, null, element, setValue, onChangeOption, __validateButtonGroupField);

	const clickHandler = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
		const id = event.currentTarget.id.replace(element.id + '-', '');
		const option = find(element.options, { id });
		setValue(option!.value);
		onChangeOption(element.id, option!.value, __validateButtonGroupField(element, option!.value));
	}, [element, onChangeOption]);

	return (
		<div id={`formButtonGroupField-${element.id}`} className={`form-button-group-field-wrapper ${element.className || ''}`}>
			{element.label ? <span className="form-button-group-label">{element.label}</span> : null}
			<div className="form-button-group-field-buttons">
				{element.options.map(choice =>
					<Button
						id={`${element.id}-${choice.id}`}
						key={`form-button-group-${choice.id}`}
						flat
						className={`form-button-group-field-button ${value === choice.value ? 'selected' : ''}`}
						onClick={clickHandler}
						{...choice.buttonProps}
					>
						{choice.label}
					</Button>
				)}
			</div>
		</div>
	);
};

export default React.memo(FormButtonGroupField);
