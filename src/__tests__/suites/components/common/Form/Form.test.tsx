import React from "react";
import { shallow } from "enzyme";
import { act } from 'react-dom/test-utils';

import Form from "@src/components/common/Form/Form";
import { ComponentProps } from "@src/components/common/Form/Form";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

let onChangeMock = jest.fn();
describe("Form common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = shallow(
				<Form
					elements={[]}
					{...props}
				/>);
		});
	};

	beforeEach(() => {
		onChangeMock = jest.fn();
		updateComponent();
	});

	it("Component default snapshot", () => {
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a text field", () => {
		updateComponent({ elements: [TestHelper.textFieldElement] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a number field", () => {
		updateComponent({ elements: [TestHelper.numberFieldElement] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a select field", () => {
		updateComponent({ elements: [TestHelper.selectFieldElement] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a autocomplete field", () => {
		updateComponent({ elements: [TestHelper.autocompleteFieldElement] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a date field", () => {
		updateComponent({ elements: [TestHelper.dateFieldElement] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a file field", () => {
		updateComponent({ elements: [TestHelper.fileFieldelement] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a component field", () => {
		updateComponent({ elements: [TestHelper.componentFormField] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a button group field", () => {
		updateComponent({ elements: [TestHelper.buttonGroupElement] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a filed with width style", () => {
		updateComponent({ elements: [{ ...TestHelper.fileFieldelement, style: { width: 50 } }] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with a filed with unique in line style", () => {
		updateComponent({ elements: [{ ...TestHelper.fileFieldelement, style: { uniqueInLine: true } }] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot after set values", () => {
		updateComponent({ elements: [TestHelper.textFieldElement, TestHelper.numberFieldElement] });
		act(() => {
			wrapper.instance().setValue("textFieldId", "forcedValue");
			wrapper.instance().setValue("numberFieldId", 100);
		});
		expect(wrapper.debug()).toMatchSnapshot();
		expect(wrapper.instance().state.forceValues).toEqual({ textFieldId: "forcedValue", numberFieldId: 100 });
	});

	it("Component get values return correct values", () => {
		updateComponent({ elements: [TestHelper.textFieldElement, TestHelper.numberFieldElement] });
		wrapper.find("Memo(FormTextField)").at(0).props().onChangeText(TestHelper.textFieldElement.id, "newVal", true);
		wrapper.find("Memo(FormNumberField)").at(0).props().onChangeNumber(TestHelper.numberFieldElement.id, 50, true);
		expect(wrapper.instance().getValues()).toEqual({ textFieldId: "newVal", numberFieldId: 50 });
	});


	it("Component get values validate form true", () => {
		updateComponent({ elements: [TestHelper.textFieldElement, TestHelper.numberFieldElement] });
		wrapper.find("Memo(FormTextField)").at(0).props().onChangeText(TestHelper.textFieldElement.id, "newVal", true);
		wrapper.find("Memo(FormNumberField)").at(0).props().onChangeNumber(TestHelper.numberFieldElement.id, 50, true);
		expect(wrapper.instance().validate()).toEqual(true);
	});

	it("Component validate form false", () => {
		updateComponent({ elements: [TestHelper.textFieldElement, TestHelper.numberFieldElement] });
		wrapper.find("Memo(FormTextField)").at(0).props().onChangeText(TestHelper.textFieldElement.id, "newVal", true);
		wrapper.find("Memo(FormNumberField)").at(0).props().onChangeNumber(TestHelper.numberFieldElement.id, 50, false);
		expect(wrapper.instance().validate()).toEqual(false);
	});

	it("Component validate form with required elements returns false", () => {
		updateComponent({ elements: [TestHelper.textFieldElement, { ...TestHelper.numberFieldElement, required: true }] });
		wrapper.find("Memo(FormTextField)").at(0).props().onChangeText(TestHelper.textFieldElement.id, "newVal", true);
		expect(wrapper.instance().validate()).toEqual(false);
	});

	it("Component validate form with required text input returns false", () => {
		updateComponent({ elements: [{ ...TestHelper.textFieldElement, required: true }, TestHelper.numberFieldElement] });
		wrapper.find("Memo(FormTextField)").at(0).props().onChangeText(TestHelper.textFieldElement.id, "", true);
		expect(wrapper.instance().validate()).toEqual(false);
	});

	it("Component on element changed should call onValueUpdated if exists", () => {
		const onValueMock = jest.fn();
		updateComponent({ elements: [{ ...TestHelper.textFieldElement, onValueUpdated: onValueMock }] });
		wrapper.find("Memo(FormTextField)").at(0).props().onChangeText(TestHelper.textFieldElement.id, "newVal", true);
		expect(onValueMock).toHaveBeenCalledTimes(1);
	});
});
