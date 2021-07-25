import { ChangeEventHandler } from 'react';

export type FormFieldProps<V extends any> = {
	readonly error?: string;
	readonly name?: string;
	readonly onChange?: ((value: V) => void) | ChangeEventHandler<any>;
	readonly onBlur?: (ev: any) => void;
	readonly value?: V;
};
