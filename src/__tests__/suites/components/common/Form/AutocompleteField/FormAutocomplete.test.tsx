import React from "react";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import FormAutocompleteField from "@src/components/common/Form/AutocompleteField/FormAutocompleteField";
import { ComponentProps } from "@src/components/common/Form/AutocompleteField/FormAutocompleteField";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const element = TestHelper.autocompleteFieldElement;

const items = TestHelper.formFieldItems;

jest.useFakeTimers();
let onChangeMock = jest.fn();
let onUpdateItemsMock = jest.fn();
describe("Autocomplete field common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = mount(
				<FormAutocompleteField
					element={element}
					error={false}
					onAutocompleteSelected={onChangeMock}
					{...props}
				/>);
		});
	};

	beforeEach(() => {
		onChangeMock = jest.fn();
		onUpdateItemsMock = jest.fn();
		updateComponent();
	});

	it("Component default snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with label with key", () => {
		updateComponent({ element: { ...element, label: { key: "lang_key" } } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with close button", () => {
		updateComponent({ element: { ...element, closeButton: true } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with items", () => {
		updateComponent({ element: { ...element, items } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on update items handler called", () => {
		onUpdateItemsMock.mockReturnValueOnce(new Promise(() => items));
		updateComponent({ element: { ...element }, onUpdateItems: onUpdateItemsMock });
		act(() => wrapper.find("Autocomplete").at(0).props().onChange("newVal"));
		act(() => { jest.runAllTimers(); });
		expect(onUpdateItemsMock).toHaveBeenCalledTimes(1);
	});

	it("Component snapshot after on change value", () => {
		act(() => wrapper.find("Autocomplete").at(0).props().onChange("newVal"));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on blur event", () => {
		act(() => wrapper.find("Autocomplete").at(0).props().onBlur());
		expect(onChangeMock).toHaveBeenCalledTimes(1);
	});

	it("Component snapshot after on autocomplete event", () => {
		act(() => wrapper.find("Autocomplete").at(0).props().onAutocomplete(null, 0, [{ label: "newlab", value: "newval" }]));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot after on autocomplete event with useValueFromAutocomplete flag enabled", () => {
		wrapper.setProps({ element: { ...element, useValueFromAutocomplete: true } });
		act(() => wrapper.find("Autocomplete").at(0).props().onAutocomplete(null, 0, [{ label: "newlab", value: "newval" }]));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot after on close event click handler", () => {
		updateComponent({ element: { ...element, closeButton: true, defaultValue: { label: "labb", value: "vall" } } });
		act(() => wrapper.find("Button").at(0).props().onChange());
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on validate base validation", () => {
		updateComponent({ element: { ...element, defaultValue: { label: "labb", value: "vall" }, validations: { fn: () => false } } });
		act(() => wrapper.find("Autocomplete").at(0).props().onBlur());
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "vall", false);
	});

	it("Component on validate url", () => {
		updateComponent({ element: { ...element, defaultValue: { label: "labb", value: "vall" }, validations: { url: true } } });
		act(() => wrapper.find("Autocomplete").at(0).props().onBlur({ target: { value: 15 } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "vall", false);
	});

	it("Component on validate correct", () => {
		updateComponent({ element: { ...element, defaultValue: { label: "labb", value: "https://gironafc.cat" }, validations: { url: true } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: 7 } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "https://gironafc.cat", true);
	});

	it("Component snapshot after on force update", () => {
		wrapper.setProps({ forceValue: { label: "labnew", value: "valnew" } });
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "valnew", true);
	});
});
