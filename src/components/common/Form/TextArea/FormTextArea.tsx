import React from 'react';
import { useField } from 'formik';
import { TextArea } from '@sergiogc9/react-ui';

import { FormTextAreaProps } from './types';

const FormTextArea: React.FC<FormTextAreaProps> = props => {
	const { helperText, name, ...rest } = props;

	const [field, meta] = useField(name);

	const isError = meta.touched && !!meta.error;

	return <TextArea {...rest} {...field} helperText={isError ? meta.error : helperText} isError={isError} />;
};

export default React.memo(FormTextArea);
