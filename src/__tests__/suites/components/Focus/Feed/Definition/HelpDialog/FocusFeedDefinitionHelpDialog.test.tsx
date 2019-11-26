import React from "react";
import { shallow } from "enzyme";

import i18n from '@src/lib/i18n';
import { FocusFeedDefinitionHelpDialog } from "@src/components/Focus/Feed/Definition/HelpDialog/FocusFeedDefinitionHelpDialog";

describe("Definition social", () => {
	let wrapper: any;
	let onCloseMock = jest.fn();

	const getComponent = () => <FocusFeedDefinitionHelpDialog
		onClose={onCloseMock}
		i18n={i18n}
		tReady={true}
		t={jest.fn()}
	/>;

	beforeEach(() => {
		onCloseMock = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with spanish locales", () => {
		wrapper.setProps({ i18n: { ...i18n, language: "es" } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with french locales", () => {
		wrapper.setProps({ i18n: { ...i18n, language: "fr" } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with italian locales", () => {
		wrapper.setProps({ i18n: { ...i18n, language: "it" } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Close icon click event", () => {
		expect(onCloseMock).toHaveBeenCalledTimes(0);
		wrapper.find("#focusFeedDefinitionHelpDialogCloseBtn").simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
	});
});
