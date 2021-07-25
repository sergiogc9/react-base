import React from 'react';
import { Formik, Form as FormikForm, FormikProps } from 'formik';
import { useUpdateEffect } from '@sergiogc9/react-hooks';

import { FormProps } from './types';

const FormEffect: React.FC<{ formikProps: FormikProps<any>; formProps: FormProps<any> }> = props => {
	const { formProps, formikProps } = props;

	useUpdateEffect(() => {
		if (formProps.onChange) formProps.onChange(formikProps.values);
	}, [formikProps.values]); // eslint-disable-line react-hooks/exhaustive-deps

	useUpdateEffect(() => {
		if (formProps.onValidChange) formProps.onValidChange(formikProps.isValid, formikProps.errors);
	}, [formikProps.errors, formikProps.isValid]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
};

const Form = <FormValues extends Record<string, unknown>>(props: FormProps<FormValues>) => {
	const { children, onSubmit } = props;

	return (
		<Formik<FormValues> {...props} validateOnMount onSubmit={onSubmit || (() => {})}>
			{formikProps => (
				<>
					<FormEffect formProps={props} formikProps={formikProps} />
					<FormikForm style={{ width: '100%' }}>{children}</FormikForm>
				</>
			)}
		</Formik>
	);
};

export default React.memo(Form) as typeof Form;
