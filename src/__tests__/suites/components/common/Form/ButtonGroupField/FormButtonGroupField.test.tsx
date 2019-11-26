import React from "react";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import FormButtonGroupField from '@src/components/common/Form/ButtonGroupField/FormButtonGroupField';
import { ComponentProps } from '@src/components/common/Form/ButtonGroupField/FormButtonGroupField';
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const element = TestHelper.buttonGroupElement;

let onChangeMock = jest.fn();

describe("Button group field component", () => {
	let wrapper: any;

	const mockClickEvent = (id: string) => ({
		currentTarget: {
			id
		}
	});

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = mount(
				<FormButtonGroupField
					element={element}
					onChangeOption={onChangeMock}
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

	it("Component without label", () => {
		updateComponent({ element: { ...element, label: '' } });
		expect(wrapper.find('.form-button-group-intro')).toHaveLength(0);
	});

	it("Component without default value", () => {
		updateComponent({ element: { ...element, defaultValue: '' } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component second option as default value", () => {
		updateComponent({ element: { ...element, defaultValue: element.options[1].value } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component first option click", () => {
		act(() => wrapper.find(".form-button-group-field-button").at(0).props().onClick(mockClickEvent(element.options[0].id)));
		expect(onChangeMock).toHaveBeenCalledTimes(1);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component second option click", () => {
		act(() => wrapper.find(".form-button-group-field-button").at(1).props().onClick(mockClickEvent(element.options[1].id)));
		expect(onChangeMock).toHaveBeenCalledTimes(1);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on validation", () => {
		updateComponent({ element: { ...element, validations: { fn: () => false } } });
		act(() => wrapper.find(".form-button-group-field-button").at(0).props().onClick(mockClickEvent(element.options[0].id)));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, element.options[0].value, false);
	});
});
