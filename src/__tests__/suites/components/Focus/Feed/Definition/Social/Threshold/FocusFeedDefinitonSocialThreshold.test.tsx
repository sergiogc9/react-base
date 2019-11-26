import React from 'react';
import { shallow } from "enzyme";

import FocusFeedDefinitonSocialThreshold from '@src/components/Focus/Feed/Definition/Social/Threshold/FocusFeedDefinitonSocialThreshold';

describe("Social definition threshold tests", () => {
	let wrapper: any;
	let onCheckToggled: any;
	let onValueChanged: any;

	beforeEach(() => {
		onCheckToggled = jest.fn();
		onValueChanged = jest.fn();

		wrapper = shallow(
			<FocusFeedDefinitonSocialThreshold
				channel={30}
				value={400}
				error={false}
				errorMessage=''
				disabled={false}
				checked={false}
				onCheckToggled={onCheckToggled}
				onValueChanged={onValueChanged}
			/>
		);
	});

	it("Test component without checked and enabled", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test threshold when checked", () => {
		expect(wrapper.find('.threshold-value-container').exists()).toEqual(false);
		expect(wrapper.find('.threshold-checkbox.checkbox-green').exists()).toEqual(false);
		wrapper.setProps({checked: true});
		expect(wrapper.find('.threshold-value-container').exists()).toEqual(true);
		expect(wrapper.find('.threshold-checkbox.checkbox-green').exists()).toEqual(true);
	});

	it("Test threshold when disabled", () => {
		wrapper.setProps({disabled: true, checked: true});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test threshold when error", () => {
		wrapper.setProps({ error: true, errorMessage: 'Lorem ipsum', checked: true});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test onCheckedToggle call", () => {
		const checkbox = wrapper.find("SelectionControl").at(0);
		checkbox.props().onChange(true);
		expect(onCheckToggled).toHaveBeenCalledWith(true);
	});

	it("Test onValueChanged call", () => {
		wrapper.setProps({checked: true});
		const input =  wrapper.find("TextField").at(0);
		input.props().onChange('');
		expect(onValueChanged).toHaveBeenCalledWith('');
		input.props().onChange('100');
		expect(onValueChanged).toHaveBeenCalledWith(100);
		input.props().onChange('-4');
		expect(onValueChanged).toHaveBeenCalledWith(0);
	});
});
