import React from "react";
import { shallow } from "enzyme";

import FocusFeedDefinitionSocialFacebookDialog from "@src/components/Focus/Feed/Definition/Social/FacebookDialog/FocusFeedDefinitionSocialFacebookDialog";
import { InstagramAccount, SearchInstagramAccount, SearchFacebookPage } from "@src/types/facebook";

const instagramAccount: InstagramAccount = {
	id: "id1",
	facebook_page_id: "facebook-page-id",
	facebook_page_name: "facebook-page-name",
	name: "Girona FC",
	profile_picture_url: "fakeurl.com",
	screen_name: "gironafc"
};

const searchInstagramAccount: SearchInstagramAccount = {
	id: "searchIg1",
	ig_id: "23i92234",
	name: "IG account",
	followers_count: 100,
	follows_count: 50,
	media_count: 10,
	username: "fakeuser",
	profile_picture_url: "fakeurl.com",
	biography: "bio",
	page: {
		id: "page1",
		name: "Facebook page",
		access_token: "token!",
		picture: { data: { url: "fakeurlpage.com" } }
	}
};

const facebookPage: SearchFacebookPage = {
	id: searchInstagramAccount.page.id,
	name: searchInstagramAccount.page.name,
	picture: searchInstagramAccount.page.picture.data.url,
	instagramAccounts: [searchInstagramAccount, { ...searchInstagramAccount, id: instagramAccount.id }]
};

describe("Definition social facebook dialog", () => {
	let wrapper: any;
	let onCloseMock = jest.fn();
	let onAuthorizeSelectedAccountsMock = jest.fn();
	let onResetDataMock = jest.fn();
	let onSetFacebookUserIdMock = jest.fn();
	let onToggleSelectedAccountMock = jest.fn();

	const getComponent = () => (
		<FocusFeedDefinitionSocialFacebookDialog
			facebookUserId={"1234"}
			instagramAccounts={[instagramAccount]}
			facebookPages={[facebookPage]}
			selectedAccounts={[]}
			onAuthorizeSelectedAccounts={onAuthorizeSelectedAccountsMock}
			onResetData={onResetDataMock}
			onSetFacebookUserId={onSetFacebookUserIdMock}
			onToggleSelectedAccount={onToggleSelectedAccountMock}
			onClose={onCloseMock}
		/>
	);

	beforeEach(() => {
		onCloseMock = jest.fn();
		onAuthorizeSelectedAccountsMock = jest.fn();
		onResetDataMock = jest.fn();
		onSetFacebookUserIdMock = jest.fn();
		onToggleSelectedAccountMock = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component default snaphsot", () => {
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot without facebook user id", () => {
		wrapper.setProps({ facebookUserId: null });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot when searching accounts", () => {
		wrapper.setProps({ instagramAccounts: null, facebookPages: null });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with no facebook pages", () => {
		wrapper.setProps({ facebookPages: [] });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component close btn handler", () => {
		expect(onCloseMock).toHaveBeenCalledTimes(0);
		expect(onResetDataMock).toHaveBeenCalledTimes(0);
		wrapper.find('FontIcon').at(0).simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
		expect(onResetDataMock).toHaveBeenCalledTimes(1);
	});

	it("Dialog onHide handler", () => {
		expect(onCloseMock).toHaveBeenCalledTimes(0);
		expect(onResetDataMock).toHaveBeenCalledTimes(0);
		wrapper.find('DialogContainer').at(0).props().onHide();
		expect(onCloseMock).toHaveBeenCalledTimes(1);
		expect(onResetDataMock).toHaveBeenCalledTimes(1);
	});

	it("Dialog on cancel button handler", () => {
		expect(onCloseMock).toHaveBeenCalledTimes(0);
		expect(onResetDataMock).toHaveBeenCalledTimes(0);
		wrapper.find('#focusFeedDefinitionSocialFacebookDialogCancelBtn').at(0).simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
		expect(onResetDataMock).toHaveBeenCalledTimes(1);
	});

	it("Dialog on accept button handler with empty selected accounts", () => {
		expect(onCloseMock).toHaveBeenCalledTimes(0);
		expect(onResetDataMock).toHaveBeenCalledTimes(0);
		expect(onAuthorizeSelectedAccountsMock).toHaveBeenCalledTimes(0);
		wrapper.find('#focusFeedDefinitionSocialFacebookDialogAcceptBtn').at(0).simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
		expect(onResetDataMock).toHaveBeenCalledTimes(1);
		expect(onAuthorizeSelectedAccountsMock).toHaveBeenCalledTimes(0);
	});

	it("Dialog on accept button handler with selected accounts", () => {
		wrapper.setProps({ selectedAccounts: ["igId"] });
		expect(onCloseMock).toHaveBeenCalledTimes(0);
		expect(onResetDataMock).toHaveBeenCalledTimes(0);
		expect(onAuthorizeSelectedAccountsMock).toHaveBeenCalledTimes(0);
		wrapper.find('#focusFeedDefinitionSocialFacebookDialogAcceptBtn').at(0).simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
		expect(onResetDataMock).toHaveBeenCalledTimes(1);
		expect(onAuthorizeSelectedAccountsMock).toHaveBeenCalledTimes(1);
	});

	it("Dialog on facebook auth logged", () => {
		wrapper.setProps({ facebookUserId: null });
		expect(onSetFacebookUserIdMock).toHaveBeenCalledTimes(0);
		wrapper.find('Connect(FacebookAuth)').at(0).props().onLogin({ userID: "1234" });
		expect(onSetFacebookUserIdMock).toHaveBeenCalledTimes(1);
		expect(onSetFacebookUserIdMock).toHaveBeenCalledWith("1234");
	});

	it("Dialog on toggle selected account", () => {
		expect(onToggleSelectedAccountMock).toHaveBeenCalledTimes(0);
		wrapper.find('#focusFeedDefinitionSocialFacebookDialogInstagramCheckbox' + searchInstagramAccount.id).at(0).props().onChange();
		expect(onToggleSelectedAccountMock).toHaveBeenCalledTimes(1);
	});
});
