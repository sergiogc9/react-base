import { TextFieldProps } from "react-md/lib/TextFields";
import { SelectFieldProps } from "react-md/lib/SelectFields/SelectField";
import { AutocompleteProps } from "react-md/lib/Autocompletes/Autocomplete";
import { DatePickerProps } from "react-md/lib/Pickers";
import { ButtonProps } from "react-md/lib/Buttons";
import { AddFileError } from "@src/components/common/Dropzone/types";

export type FormFieldItem = { label: string, value: string };

export type BaseFormValidations = {
    fn?: (value: any) => boolean
};
type BaseFormStyle = {
    width?: 25 | 33 | 50 | 66 | 75 | 100,
    newLine?: boolean, // Forces field to be put in a new line (even if it should fit in current line)
    uniqueInLine?: boolean // Forces field to be put only itself in the line
}

export type BaseFieldElement = {
    id: string,
    required?: boolean,
    disabled?: boolean,
    className?: string,
    style?: BaseFormStyle,
    onValueUpdated?: (value: any) => void
};

export type TextFieldElementValidations = BaseFormValidations & { maxLength?: number, minLength?: number, url?: boolean };

export type TextFieldElement = BaseFieldElement & {
    type: "text",
    label: string | { key: string },
    defaultValue?: string,
    inputProps?: Partial<TextFieldProps>,
    validations?: TextFieldElementValidations
};

export type NumberFieldElementValidations = BaseFormValidations & { max?: number, min?: number };

export type NumberFieldElement = BaseFieldElement & {
    type: "number",
    label: string | { key: string },
    defaultValue?: number,
    inputProps?: Partial<TextFieldProps>,
    validations?: NumberFieldElementValidations
};

export type SelectFieldElementValidations = BaseFormValidations;

export type SelectFieldElement = BaseFieldElement & {
    type: "select",
    label: string | { key: string },
    items: FormFieldItem[],
    defaultValue?: string,
    inputProps?: Partial<SelectFieldProps>,
    validations?: SelectFieldElementValidations
};

export type AutocompleteFieldElementValidations = BaseFormValidations & {
    url?: boolean
};

export type AutocompleteFieldElement = BaseFieldElement & {
    type: "autocomplete",
    label: string | { key: string },
    items: FormFieldItem[],
    defaultValue?: FormFieldItem,
    inputProps?: Partial<AutocompleteProps>,
    validations?: AutocompleteFieldElementValidations,
    closeButton?: boolean,
    useValueFromAutocomplete?: boolean, // Uses item.value from result instead of item.label as the new label
    alwaysShowItems?: boolean, // Show items even if no filtered value is set
    onUpdateItems?: (newValue: string) => Promise<AutocompleteFieldElement["items"]>
};

export type FileFieldElementValidations = BaseFormValidations;

export type FileFieldElement = BaseFieldElement & {
    type: "file",
    defaultValue?: File[],
    validations?: FileFieldElementValidations,
    multiple: boolean,
    accept?: string,
    maxSize?: number,
    onFileErrors?: (errors: AddFileError[]) => void // Some default errors are yet catched by Field component itself
};

export type DateFieldElementValidations = BaseFormValidations;

export type DateFieldElement = BaseFieldElement & {
    type: "date",
    defaultValue?: Date,
    validations?: DateFieldElementValidations,
    minDate?: Date,
    maxDate?: Date,
    inputProps?: Partial<DatePickerProps>
};

export type CustomComponentField = {
    id: string,
    type: "component",
    component: JSX.Element,
    style?: BaseFormStyle,
};

type ButtonGroupOption = {
    id: string,
    label: string,
    value: string,
    buttonProps?: Partial<ButtonProps>
};

export type ButtonGroupFieldElementValidations = BaseFormValidations;

export type ButtonGroupFieldElement = BaseFieldElement & {
    type: "buttonGroup",
    options: ButtonGroupOption[],
    label?: string,
    defaultValue?: string,
    validations?: ButtonGroupFieldElementValidations
};

// eslint-disable-next-line max-len
export type FormFieldElement = TextFieldElement | NumberFieldElement | SelectFieldElement | AutocompleteFieldElement | FileFieldElement | DateFieldElement | CustomComponentField | ButtonGroupFieldElement;
