import React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import lodashValues from 'lodash/values';

import { FormFieldElement } from '@src/types/form';
import FormTextField from './TextField/FormTextField';
import FormNumberField from './NumberField/FormNumberField';
import FormSelectField from './SelectField/FormSelectField';
import FormAutocomplete from './AutocompleteField/FormAutocompleteField';
import FormDateField from './DateField';
import FormFileField from './FileField';
import FormButtonGroupField from './ButtonGroupField/FormButtonGroupField';

import './Form.scss';

export type ComponentProps = {
	elements: FormFieldElement[]
};

type ComponentState = {
	errors: FormErrors,
	values: FormValues,
	forceValues: FormValues
}

type FormErrors = {
	[key: string]: boolean
};

type FormValues = {
	[key: string]: any
};

export const formFieldBaseValidation = (element: FormFieldElement, newValue: any) => {
	if (element.type === "component") return true;
	if (element.required && !newValue) return false;
	if (!element.validations) return true;
	if (element.validations.fn && !element.validations.fn(newValue)) return false;
	return true;
};

class Form extends React.PureComponent<ComponentProps, ComponentState> {

	constructor(props: ComponentProps) {
		super(props);
		this.state = {
			values: props.elements.reduce((values, el) => {
				if (el.type === "component") return values;
				return { ...values, [el.id]: el.defaultValue };
			}, {}),
			forceValues: {},
			errors: props.elements.reduce((values, el) => {
				if (el.type === "component") return values;
				return { ...values, [el.id]: false };
			}, {})
		};
	}

	private __getBreakLineElement = () => <div className="discover-form-field-break-line" />;

	private __getFieldClasses = (element: FormFieldElement) => {
		const classes = [];

		if (element.type !== "component" && element.style) {
			if (element.style.width) classes.push(`discover-form-field-width-${element.style.width}`);
		}

		return classes;
	};

	private __getFieldFromElement = (element: FormFieldElement) => {
		const { errors, forceValues } = this.state;
		let field = null;
		switch (element.type) {
			case "text":
				field = <FormTextField
					element={element}
					forceValue={forceValues[element.id]}
					error={errors[element.id]}
					onChangeText={this.__onValueChanged}
				/>;
				break;
			case "number":
				field = <FormNumberField
					element={element}
					forceValue={forceValues[element.id]}
					error={errors[element.id]}
					onChangeNumber={this.__onValueChanged}
				/>;
				break;
			case "select":
				field = <FormSelectField
					element={element}
					forceValue={forceValues[element.id]}
					error={errors[element.id]}
					onSelectOption={this.__onValueChanged}
				/>;
				break;
			case "autocomplete":
				field = <FormAutocomplete
					element={element}
					forceValue={forceValues[element.id]}
					error={errors[element.id]}
					onAutocompleteSelected={this.__onValueChanged}
					onUpdateItems={element.onUpdateItems}
				/>;
				break;
			case "file":
				field = <FormFileField
					element={element}
					forceValue={forceValues[element.id]}
					error={errors[element.id]}
					onChangeFile={this.__onValueChanged}
				/>;
				break;
			case "date":
				field = <FormDateField
					element={element}
					forceValue={forceValues[element.id]}
					error={errors[element.id]}
					onChangeDate={this.__onValueChanged}
				/>;
				break;
			case "component":
				field = element.component;
				break;
			case "buttonGroup":
				field = <FormButtonGroupField
					element={element}
					forceValue={forceValues[element.id]}
					onChangeOption={this.__onValueChanged}
				/>;
				break;
		}

		const classNames = ["discover-form-field", ...this.__getFieldClasses(element)].join(' ');
		const beforeElement = get(element, "style.newLine") || get(element, "style.uniqueInLine") ? this.__getBreakLineElement() : null;
		const afterElement = get(element, "style.uniqueInLine") ? this.__getBreakLineElement() : null;
		return (
			<React.Fragment key={element.id}>
				{beforeElement}
				<div className={classNames}>
					{field}
				</div>
				{afterElement}
			</React.Fragment>
		);
	};

	private __onValueChanged = (elementId: string, value: any, isValid: boolean) => {
		const { values, errors } = this.state;

		this.setState({
			values: { ...values, [elementId]: value },
			errors: { ...errors, [elementId]: !isValid }
		});

		const element = this.__findElement(elementId);
		if (element.type === "component") return;
		if (element.onValueUpdated) element.onValueUpdated(value);
	}

	private __findElement = (elementId: string): FormFieldElement => {
		const { elements } = this.props;
		return find(elements, { id: elementId }) as FormFieldElement;
	}

	public getValues = () => {
		return this.state.values;
	}

	public setValue = (key: string, value: any) => {
		const { forceValues } = this.state;

		this.setState({ forceValues: { ...forceValues, [key]: value } });
	}

	public validate = () => {
		const { values, errors } = this.state;
		const { elements } = this.props;

		const finalErrors = elements.reduce<FormErrors>((newErrors, element) => {
			if (element.type === "component") return newErrors;
			const isValid = !errors[element.id] && (!element.required || !!values[element.id]);
			newErrors[element.id] = !isValid;
			return newErrors;
		}, {});

		this.setState({ errors: finalErrors });
		return lodashValues(finalErrors).reduce((isValid, current) => isValid && !current, true);
	}

	public render() {
		const { elements } = this.props;

		return (
			<div className="discover-form">
				{elements.map(el => this.__getFieldFromElement(el))}
			</div>
		);
	}
};

export default Form;
