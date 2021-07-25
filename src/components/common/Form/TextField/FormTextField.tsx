import React from 'react';
import { useField } from 'formik';
import { TextField, TextFieldDateProps } from '@sergiogc9/react-ui';

import { FormTextFieldProps } from './types';

const FormInput: React.FC<FormTextFieldProps> = props => {
	const { helperText, name, type, ...rest } = props;

	const [field, meta, helpers] = useField(name);

	const isError = meta.touched && !!meta.error;

	const dateProps = React.useMemo<TextFieldDateProps>(() => {
		if (type !== 'date') return {};
		return {
			defaultDate: field.value || undefined,
			onDateChange: date => {
				helpers.setTouched(true);
				helpers.setValue(date || null);
			}
		};
	}, [field.value, helpers, type]);

	return (
		<TextField
			{...rest}
			{...field}
			{...dateProps}
			helperText={isError ? meta.error : helperText}
			isError={isError}
			type={type}
		/>
	);
};

export default React.memo(FormInput);
