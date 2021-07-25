import React from 'react';
import { useField } from 'formik';
import { Select, SelectProps } from '@sergiogc9/react-ui';

import { FormSelectProps } from './types';

const FormSelect: React.FC<FormSelectProps> = props => {
	const { helperText, name, onBlur, ...rest } = props;

	const [field, meta, helpers] = useField(name);

	const isError = meta.touched && !!meta.error;

	const onSelectBlurred = React.useCallback<NonNullable<SelectProps['onBlur']>>(
		ev => {
			helpers.setTouched(true);
			if (onBlur) onBlur(ev);
		},
		[helpers, onBlur]
	);

	const onOptionChanged = React.useCallback<NonNullable<SelectProps['onOptionChange']>>(
		ids => {
			helpers.setValue(ids);
		},
		[helpers]
	);

	return (
		<Select
			{...rest}
			helperText={isError ? meta.error : helperText}
			isError={isError}
			onBlur={onSelectBlurred}
			onOptionChange={onOptionChanged}
			value={field.value}
		/>
	);
};

export default React.memo(FormSelect);
