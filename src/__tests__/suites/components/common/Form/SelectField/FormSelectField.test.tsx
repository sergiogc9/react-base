import React from "react";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import FormSelectField from "@src/components/common/Form/SelectField/FormSelectField";
import { ComponentProps } from "@src/components/common/Form/SelectField/FormSelectField";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const element = TestHelper.selectFieldElement;

const items = TestHelper.formFieldItems;

let onChangeMock = jest.fn();
describe("Select field common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = mount(
				<FormSelectField
					element={element}
					error={false}
					onSelectOption={onChangeMock}
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

	it("Component snapshot with items", () => {
		updateComponent({ element: { ...element, items } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on blur text input", () => {
		act(() => wrapper.find("SelectField").at(0).props().onChange("newVal"));
		expect(wrapper.html()).toMatchSnapshot();
		expect(onChangeMock).toHaveBeenCalledTimes(1);
	});

	it("Component on validate base validation", () => {
		updateComponent({ element: { ...element, validations: { fn: () => false } } });
		act(() => wrapper.find("SelectField").at(0).props().onChange("newValue"));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "newValue", false);
	});

	it("Component on validate correct", () => {
		updateComponent({ element: { ...element, validations: {} } });
		act(() => wrapper.find("SelectField").at(0).props().onChange("12345"));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "12345", true);
	});

	it("Component snapshot after on force update", () => {
		wrapper.setProps({ forceValue: "forced!" });
		expect(onChangeMock).toHaveBeenCalledWith(element.id, "forced!", true);
		expect(wrapper.html()).toMatchSnapshot();
	});
});
