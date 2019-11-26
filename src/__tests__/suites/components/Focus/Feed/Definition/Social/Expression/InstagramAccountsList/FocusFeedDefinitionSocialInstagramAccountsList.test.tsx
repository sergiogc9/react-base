import React from "react";
import { shallow } from "enzyme";

import FocusFeedDefinitionSocialInstagramAccountsList from "@src/components/Focus/Feed/Definition/Social/Expression/InstagramAccountsList/FocusFeedDefinitionSocialInstagramAccountsList";
import { SocialInstagramAccount, DefinitionSocialInstagramAccount } from "@src/class/Feed";

const instagramAccount: SocialInstagramAccount = {
	id: "id1",
	name: "Girona FC",
	profile_picture_url: "fakeurl.com",
	screen_name: "gironafc",
	valid: true
};
const instagramAccount2: SocialInstagramAccount = {
	id: "id2",
	name: "Fake Instagramer",
	profile_picture_url: "fakeurl.com",
	screen_name: "fake_instagramer",
	valid: true
};
const instagramAccounts = [instagramAccount, instagramAccount2];
const definitionInstagramAccount: DefinitionSocialInstagramAccount = {
	id: "id1",
	screen_name: "gironafc",
	linkedExpression: { type: "include_expressions", index: 0 }
};

describe("Definition social instagram accounts list", () => {
	let wrapper: any;
	let onInstagramAccountSelected = jest.fn();

	const getComponent = () => (
		<FocusFeedDefinitionSocialInstagramAccountsList
			instagramAccounts={instagramAccounts}
			definitionInstagramAccounts={[]}
			expressionKey="include_expressions"
			index={0}
			onInstagramAccountSelected={onInstagramAccountSelected}
		/>
	);

	beforeEach(() => {
		onInstagramAccountSelected = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component default snaphsot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snaphsot without instagram accounts loaded", () => {
		wrapper.setProps({ instagramAccounts: null });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snaphsot with an instagram account used in another expression", () => {
		wrapper.setProps({ definitionInstagramAccounts: [definitionInstagramAccount] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snaphsot with dialog shown", () => {
		wrapper.setState({ showFacebookDialog: true });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Facebook dialog onClose handler", () => {
		wrapper.setState({ showFacebookDialog: true });
		wrapper.find('Connect(FocusFeedDefinitionSocialFacebookDialog)').at(0).props().onClose();
		expect(wrapper.state().showFacebookDialog).toBe(false);
	});

	it("On click connect new account should show facebook dialog", () => {
		wrapper.find('#focusFeedDefinitionSocialInstagramAccountAddNew').at(0).simulate('click');
		expect(wrapper.state().showFacebookDialog).toBe(true);
	});

	it("On instagram account clicked", () => {
		expect(onInstagramAccountSelected).toHaveBeenCalledTimes(0);
		wrapper.find(`FocusFeedDefinitionSocialInstagramAccount`).at(0).props().onSelected();
		expect(onInstagramAccountSelected).toHaveBeenCalledTimes(1);
		expect(onInstagramAccountSelected).toHaveBeenCalledWith({
			id: definitionInstagramAccount.id,
			screen_name: definitionInstagramAccount.screen_name,
			linkedExpression: { type: "include_expressions", index: 0 }
		});
	});
});
