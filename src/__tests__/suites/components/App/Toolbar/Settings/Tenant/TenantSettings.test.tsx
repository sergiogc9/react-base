import { mount } from "enzyme";
import React from "react";

import { Settings as TenantSettingsObject } from "@src/class/Tenant";
import TenantSettings from "@src/components/App/Toolbar/Settings/Tenant/TenantSettings";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const tenantSettingsObject: TenantSettingsObject = {
	categorization_mode: "all",
	facebook_url: "https://www.facebook.com/conjunt.chapo",
	currency: "USD",
	display_influencers: true,
	valuation_metric: "miv",
	document_tenant_indices_search: false
};

const user = TestHelper.getUser();

const updateSettingsMock = jest.fn();
const updateFacebookUrlMock = jest.fn();
const closeModalMock = jest.fn();

describe("TenantSettings", () => {
	let wrapper: any;

	beforeEach(() => {
		wrapper = mount(
			<TenantSettings
				tenantSettings={tenantSettingsObject}
				loading={false}
				loadingFacebookImageUrl={false}
				facebookImageUrl=""
				onUpdateFacebookUrl={updateFacebookUrlMock}
				onUpdateTenantSettings={updateSettingsMock}
				onAddNotification={jest.fn()}
				onClose={closeModalMock}
				user={user}
			/>
		);
	});

	it("Test component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test update facebook url event handler", () => {
		wrapper.find('TextField#tenantFacebookUrl').simulate('focus');
		wrapper.find('SelectField#tenantCurrency').simulate('focus');
		expect(updateFacebookUrlMock).toHaveBeenCalledTimes(2); // One time on component mount and other after click events
	});

	it("Test clear facebook_url input", () => {
		expect(wrapper.state().settings.facebook_url).toStrictEqual('https://www.facebook.com/conjunt.chapo');
		wrapper.find('Button#clearFacebookUrlInput').simulate('click');
		expect(wrapper.state().settings.facebook_url).toStrictEqual('');
	});

	it("Test click save button event handler when no changes", () => {
		wrapper.find('Button#tenantSettingsSave').simulate('click');
		expect(updateSettingsMock).toHaveBeenCalledTimes(0);
	});

	it("Test click save button event handler when changes", () => {
		wrapper.find('Button#clearFacebookUrlInput').simulate('click');
		wrapper.find('Button#tenantSettingsSave').simulate('click');
		expect(updateSettingsMock).toHaveBeenCalledTimes(1);
	});

	it("Test update facebook image loading", () => {
		wrapper.setProps({
			...wrapper.props(),
			loadingFacebookImageUrl: true
		});
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test close dialog button", () => {
		wrapper.find('Button#closeTenantSettingsButton').simulate('click');
		expect(closeModalMock).toHaveBeenCalled();
	});
});
