import React from 'react';
import { useController } from 'react-hook-form';
import { CheckBox } from '@sergiogc9/react-ui';

import { FormCheckBoxProps } from './types';

const FormCheckBox: React.FC<FormCheckBoxProps> = props => {
	const { name, ...rest } = props;

	const { field } = useController({ name });

	return (
		<CheckBox
			{...rest}
			isDefaultSelected={field.value}
			name={field.name}
			onBlur={field.onBlur}
			onChange={field.onChange}
		/>
	);
};

export default React.memo(FormCheckBox);
