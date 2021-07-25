import React from 'react';
import { useField } from 'formik';

import { FormFieldProps } from './types';

/**
 * Creates a component ready to be used inside a Formik form
 * @param Component The component to be used. It has to implement the props defined in FormFieldProps.
 * @returns A new component that can be used inside a form
 */
const withFormField = <V extends any = string, P extends FormFieldProps<V> = FormFieldProps<V>>(
	Component: React.FC<P>
) => {
	return React.memo<P & { name: string }>(props => {
		const { name } = props;

		const [field, meta] = useField<V>({ name });

		const isError = meta.touched && !!meta.error;

		const { onChange } = field;
		const onValueChanged = React.useCallback(
			(value: V) => {
				if (typeof value === 'object' && ((value as any).target || (value as any).currentTarget)) onChange(value);
				else onChange({ target: { name, value } });
			},
			[name, onChange]
		);

		return <Component {...props} {...field} error={isError ? meta.error : undefined} onChange={onValueChanged} />;
	});
};
export default withFormField;
