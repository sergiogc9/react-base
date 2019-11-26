import React from "react";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import FormNumberField from "@src/components/common/Form/NumberField/FormNumberField";
import { ComponentProps } from "@src/components/common/Form/NumberField/FormNumberField";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const element = TestHelper.numberFieldElement;

let onChangeMock = jest.fn();
describe("Number field common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = mount(
				<FormNumberField
					element={element}
					error={false}
					onChangeNumber={onChangeMock}
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
		act(() => wrapper.find("TextField").at(0).props().onChange(15));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on blur text input", () => {
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: 15 } }));
		expect(onChangeMock).toHaveBeenCalledTimes(1);
	});

	it("Component on validate base validation", () => {
		updateComponent({ element: { ...element, validations: { fn: () => false } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: 5 } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, 5, false);
	});

	it("Component on validate base validation with required but empty value", () => {
		updateComponent({ element: { ...element, required: true } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: undefined } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, NaN, false);
	});

	it("Component on validate max", () => {
		updateComponent({ element: { ...element, validations: { max: 10 } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: 15 } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, 15, false);
	});

	it("Component on validate min", () => {
		updateComponent({ element: { ...element, validations: { min: 5 } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: 1 } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, 1, false);
	});

	it("Component on validate correct", () => {
		updateComponent({ element: { ...element, validations: { min: 5, max: 10 } } });
		act(() => wrapper.find("TextField").at(0).props().onBlur({ target: { value: 7 } }));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, 7, true);
	});

	it("Component snapshot after on force update", () => {
		wrapper.setProps({ forceValue: 20 });
		expect(onChangeMock).toHaveBeenCalledWith(element.id, 20, true);
		expect(wrapper.html()).toMatchSnapshot();
	});
});
