import React from 'react';
import { useController } from 'react-hook-form';
import { TextField, TextFieldDateProps } from '@sergiogc9/react-ui';

import { FormTextFieldProps } from './types';

const FormInput: React.FC<FormTextFieldProps> = props => {
	const { helperText, name, type, ...rest } = props;

	const { field, fieldState, formState } = useController({ name });

	const isError = (fieldState.isTouched || formState.isSubmitted) && fieldState.invalid;

	const dateProps = React.useMemo<TextFieldDateProps>(() => {
		if (type !== 'date') return {};
		return {
			defaultDate: field.value || undefined,
			onDateChange: date => {
				field.onChange(date);
			}
		};
	}, [field, type]);

	return (
		<TextField
			{...rest}
			{...field}
			{...dateProps}
			helperText={isError ? fieldState.error?.message : helperText}
			isError={isError}
			type={type}
		/>
	);
};

export default React.memo(FormInput);
