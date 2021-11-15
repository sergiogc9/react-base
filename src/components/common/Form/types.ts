import React from 'react';
import * as yup from 'yup';
import { DeepMap, DeepPartial, FieldError, UseFormProps } from 'react-hook-form';
import { BoxProps } from '@sergiogc9/react-ui';

import { RecursivePartial } from 'types/generics';

export type FormHelpers = {
	setErrors: (errors: Record<string, string>) => void;
};

export type Props<FormValues extends Record<string, unknown> = Record<string, unknown>> = {
	readonly children: React.ReactNode;
	readonly defaultValues: RecursivePartial<FormValues>;
	readonly onChange?: (values: FormValues) => void;
	readonly onSubmit?: (values: FormValues, formHelpers: FormHelpers) => void;
	readonly onValidChange?: (isValid: boolean, errors: DeepMap<DeepPartial<FormValues>, FieldError>) => void;
	readonly useFormProps?: Omit<UseFormProps<FormValues>, 'defaultValues'>;
	readonly validationSchema?: yup.ObjectSchema<FormValues | undefined>;
};

export type FormProps<FormValues extends Record<string, unknown> = Record<string, unknown>> = Props<FormValues> &
	Omit<BoxProps<React.HTMLAttributes<HTMLFormElement>>, 'onChange' | 'onSubmit'>;

export type StyledFormProps = BoxProps<React.HTMLAttributes<HTMLFormElement>>;

export type FormEffectProps<FormValues extends Record<string, unknown> = Record<string, unknown>> = Pick<
	FormProps<FormValues>,
	'onChange' | 'onValidChange'
>;
