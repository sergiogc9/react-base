import React from 'react';
import { useField } from 'formik';
import { CheckBox } from '@sergiogc9/react-ui';

import { FormCheckBoxProps } from './types';

const FormCheckBox: React.FC<FormCheckBoxProps> = props => {
	const { name, ...rest } = props;

	const [field] = useField<boolean>(name);

	return <CheckBox {...rest} {...field} isDefaultSelected={field.value} isSelected={field.value} value={undefined} />;
};

export default React.memo(FormCheckBox);
