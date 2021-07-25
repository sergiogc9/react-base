import { FormikConfig, FormikErrors, FormikHelpers } from 'formik';
import * as yup from 'yup';

export type FormHelpers<T> = FormikHelpers<T>;

export type FormProps<FormValues extends Record<string, unknown> = Record<string, unknown>> = Omit<
	FormikConfig<FormValues>,
	'onSubmit'
> & {
	readonly children: React.ReactNode;
	readonly validationSchema?: yup.ObjectSchema<FormValues | undefined>;
	readonly onChange?: (values: FormValues) => void;
	readonly onSubmit?: (values: FormValues, formikHelpers: FormHelpers<FormValues>) => void;
	readonly onValidChange?: (isValid: boolean, errors: FormikErrors<FormValues>) => void;
};
