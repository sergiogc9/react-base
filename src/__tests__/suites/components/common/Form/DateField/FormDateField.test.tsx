import React from "react";
import { DatePicker } from "react-md/lib/Pickers";
import { act } from 'react-dom/test-utils';
import moment from 'moment';
import mockDate from 'mockdate';

import FormDateField from "@src/components/common/Form/DateField/";
import { ComponentProps } from "@src/components/common/Form/DateField/types";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const element = TestHelper.dateFieldElement;
const user = TestHelper.getUser();
const date = new Date();
const expectedDate = moment.tz(moment(date).format('YYYY-MM-DD'), "UTC").toDate();

let onChangeMock = jest.fn();
describe("Date field common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = TestHelper.getWrappedComponent(
				<FormDateField
					element={element}
					error={false}
					onChangeDate={onChangeMock}
					{...props}
				/>, { app: { profile: { user } } }).component;
		});
	};

	beforeAll(() => {
		mockDate.set(new Date("2019-10-28"));
	});

	afterAll(() => {
		mockDate.reset();
	});

	beforeEach(() => {
		onChangeMock = jest.fn();
		updateComponent();
	});

	it("Component default snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on change date input", () => {
		act(() => wrapper.find(DatePicker).at(0).props().onChange(null, new Date(), null));
		expect(onChangeMock).toHaveBeenCalledTimes(1);
	});

	it("Component on validate base validation", () => {
		updateComponent({ element: { ...element, validations: { fn: () => false } } });
		act(() => wrapper.find(DatePicker).at(0).props().onChange(null, date, null));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, expectedDate, false);
	});

	it("Component on validate correct", () => {
		updateComponent({ element: { ...element, validations: {} } });
		act(() => wrapper.find(DatePicker).at(0).props().onChange(null, date, null));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, expectedDate, true);
	});

	it("Component snapshot after on force update", () => {
		updateComponent({ forceValue: new Date(0) });
		expect(onChangeMock).toHaveBeenCalledWith(element.id, new Date(0), true);
		expect(wrapper.html()).toMatchSnapshot();
	});
});
