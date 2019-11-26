import React from "react";
import { shallow } from "enzyme";

import FocusFeedDefinitionSocialInstagramAccount from "@src/components/Focus/Feed/Definition/Social/Expression/InstagramAccount/FocusFeedDefinitionSocialInstagramAccount";
import { SocialInstagramAccount } from "@src/class/Feed";

const instagramAccount: SocialInstagramAccount = {
	id: "id1",
	name: "Girona FC",
	profile_picture_url: "fakeurl.com",
	screen_name: "gironafc",
	valid: true
};

describe("Definition social instagram account", () => {
	let wrapper: any;
	let onSelected = jest.fn();

	const getComponent = () => (
		<FocusFeedDefinitionSocialInstagramAccount
			account={instagramAccount}
			removable={false}
			onSelected={onSelected}
		/>
	);

	beforeEach(() => {
		onSelected = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component default snaphsot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snaphsot with removable props", () => {
		wrapper.setProps({ removable: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snaphsot with not valid account", () => {
		wrapper.setProps({ account: { ...instagramAccount, valid: false } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("On remove expression", () => {
		expect(onSelected).toHaveBeenCalledTimes(0);
		wrapper.find(`#focusFeedDefinitionSocialInstagramAccount${instagramAccount.id}`).at(0).simulate('click');
		expect(onSelected).toHaveBeenCalledTimes(1);
	});
});
