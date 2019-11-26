import React from "react";
import {
	TextFieldElement,
	NumberFieldElement,
	SelectFieldElement,
	AutocompleteFieldElement,
	FileFieldElement,
	DateFieldElement,
	FormFieldItem,
	CustomComponentField,
	ButtonGroupFieldElement
} from '@src/types/form';

const textFieldElement: TextFieldElement = {
	type: "text",
	id: "textFieldId",
	label: "Text label"
};

const numberFieldElement: NumberFieldElement = {
	type: "number",
	id: "numberFieldId",
	label: "Text label"
};

const selectFieldElement: SelectFieldElement = {
	type: "select",
	id: "selectFieldId",
	label: "Text label",
	items: []
};

const autocompleteFieldElement: AutocompleteFieldElement = {
	type: "autocomplete",
	id: "autocompleteFieldId",
	label: "Text label",
	items: []
};

const fileFieldelement: FileFieldElement = {
	type: "file",
	id: "fileFieldId",
	multiple: false
};

const dateFieldElement: DateFieldElement = {
	type: "date",
	id: "dateFieldId"
};

const componentFormField: CustomComponentField = {
	id: "component_id",
	type: "component",
	component: React.createElement("div")
};

const buttonGroupElement: ButtonGroupFieldElement = {
	id: "field_id",
	type: "buttonGroup",
	label: "Some intro",
	defaultValue: 'option1',
	options: [{
		id: 'FirstButtonId',
		label: 'First choice',
		value: 'option1'
	},
	{
		id: 'Second ButtonId',
		label: 'Second choice',
		value: 'option2'
	}
	]
};

const formFieldItems: FormFieldItem[] = [
	{ label: "lab1", value: "val1" },
	{ label: "lab2", value: "val2" }
];


export default {
	textFieldElement,
	numberFieldElement,
	selectFieldElement,
	autocompleteFieldElement,
	fileFieldelement,
	dateFieldElement,
	formFieldItems,
	componentFormField,
	buttonGroupElement
};
