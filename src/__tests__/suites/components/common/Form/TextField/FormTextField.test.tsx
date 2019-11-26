import React from "react";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import FormTextField from "@src/components/common/Form/TextField/FormTextField";
import { ComponentProps } from "@src/components/common/Form/TextField/FormTextField";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const element = TestHelper.textFieldElement;

let onChangeMock = jest.fn();
describe("Text field common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = mount(
				<FormTextField
					element={element}
					error={false}
					onChangeText={onChangeMock}
					{...props}
				/>);
		});
	};

	beforeEach(() => {
		onChangeMock = jest.fn();
		updateComponent();
	});

	it("Component default snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with label with key", () => {
		updateComponent({ element: { ...element, label: { key: "lang_key" } } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot after on change text input", () => {
		act(() => wrapper.find("TextField").at(0).props().onChange("newVal"));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on blur text input", () => {
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "newVal" } }));
		expect(onChangeMock).toHaveBeenCalledTimes(1);
	});

	it("Component on validate base validation without validation", () => {
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "newValue" } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "newValue", true);
	});

	it("Component on validate base validation with required but empty value", () => {
		updateComponent({ element: { ...element, required: true } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "" } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "", false);
	});

	it("Component on validate base validation", () => {
		updateComponent({ element: { ...element, validations: { fn: () => false } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "newValue" } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "newValue", false);
	});

	it("Component on validate maxLength", () => {
		updateComponent({ element: { ...element, validations: { maxLength: 10 } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "12345678901" } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "12345678901", false);
	});

	it("Component on validate minLength", () => {
		updateComponent({ element: { ...element, validations: { minLength: 5 } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "123" } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "123", false);
	});

	it("Component on validate url", () => {
		updateComponent({ element: { ...element, validations: { url: true } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "bad_url" } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "bad_url", false);
	});

	it("Component on validate correct", () => {
		updateComponent({ element: { ...element, validations: { minLength: 5 } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: "12345" } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "12345", true);
	});

	it("Component snapshot after on force update", () => {
		wrapper.setProps({ forceValue: "forced!" });
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "forced!", true);
		expect(wrapper.html()).toMatchSnapshot();
	});
});
