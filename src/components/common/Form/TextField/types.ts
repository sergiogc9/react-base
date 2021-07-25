import { TextFieldProps } from '@sergiogc9/react-ui';

export type FormTextFieldProps = Omit<TextFieldProps, 'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'value'> &
	Required<Pick<TextFieldProps, 'name'>>;
