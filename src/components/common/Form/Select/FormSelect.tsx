import React from 'react';
import { useController } from 'react-hook-form';
import { Select, SelectProps } from '@sergiogc9/react-ui';

import { FormSelectProps } from './types';

const FormSelect: React.FC<FormSelectProps> = props => {
	const { helperText, name, ...rest } = props;

	const { field, fieldState } = useController({ name });

	const isError = fieldState.isTouched && fieldState.invalid;

	const onSelectBlurred = React.useCallback<NonNullable<SelectProps['onBlur']>>(() => {
		if (!fieldState.isTouched) field.onBlur();
	}, [field, fieldState.isTouched]);

	const onSelectChanged = React.useCallback<NonNullable<SelectProps['onOptionChange']>>(
		ids => {
			field.onChange(ids);
			field.onBlur();
		},
		[field]
	);

	return (
		<Select
			{...rest}
			helperText={isError ? fieldState.error?.message : helperText}
			isError={isError}
			onBlur={onSelectBlurred}
			onOptionChange={onSelectChanged}
			value={field.value}
		/>
	);
};

export default React.memo(FormSelect);
