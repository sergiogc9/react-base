import { mount } from "enzyme";
import React from "react";
import CircularProgress from "react-md/lib/Progress/CircularProgress";

import { UserObject } from "@src/class/User";
import UserSettings from "@src/components/App/Toolbar/Settings/User/UserSettings";
import { FacebookAccount } from "@src/types/facebook";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const user = TestHelper.getUser();

const facebookAccounts: FacebookAccount[] = [
	{
		expires_at: new Date(1549287550563),
		id: "facebook-id",
		insights_user_id: "insights-user-id",
		instagramAccounts: [{
			id: "instagram-id",
			facebook_page_id: "facebook-page-id",
			facebook_page_name: "facebook-page-name",
			name: "Instagram name",
			profile_picture_url: "http://fakeurl.com",
			screen_name: "insta-user"
		}],
		is_valid: true,
		name: "facebook name",
		picture_url: "http://fakeurl.com",
		scope: "",
		updated_at: new Date(1549287550563)
	}
];

const timezones = ["Europe/Girona", "Europe/Palencia"];

let updateUserSettingsMock: jest.Mock;
let onCloseMock: jest.Mock;
let onFetchUserFacebookAccounts: jest.Mock;
let onDeauthorizeFacebookAccountMock: jest.Mock;
let onDeauthorizeInstagramAccountMock: jest.Mock;
let onFetchTimezones: jest.Mock;

describe("UserSettings", () => {
	let wrapper: any;

	beforeEach(() => {
		onCloseMock = jest.fn();
		onFetchUserFacebookAccounts = jest.fn();
		updateUserSettingsMock = jest.fn();
		onDeauthorizeFacebookAccountMock = jest.fn();
		onDeauthorizeInstagramAccountMock = jest.fn();
		onFetchTimezones = jest.fn();

		wrapper = mount(
			<UserSettings
				user={user}
				facebookAccounts={facebookAccounts}
				loading={false}
				onUpdateUserSettings={updateUserSettingsMock}
				onFetchUserFacebookAccounts={onFetchUserFacebookAccounts}
				onDeauthorizeFacebookAccount={onDeauthorizeFacebookAccountMock}
				onDeauthorizeInstagramAccount={onDeauthorizeInstagramAccountMock}
				onClose={onCloseMock}
				timezones={timezones}
				onFetchTimezones={onFetchTimezones}
			/>
		);
	});

	it("Test UserSettings component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test UserSettings component without facebookAccounts", () => {
		expect(onFetchUserFacebookAccounts).toHaveBeenCalledTimes(0);
		wrapper = mount(
			<UserSettings
				user={user}
				facebookAccounts={null}
				loading={false}
				onUpdateUserSettings={updateUserSettingsMock}
				onFetchUserFacebookAccounts={onFetchUserFacebookAccounts}
				onDeauthorizeFacebookAccount={onDeauthorizeFacebookAccountMock}
				onDeauthorizeInstagramAccount={onDeauthorizeInstagramAccountMock}
				onClose={onCloseMock}
				timezones={timezones}
				onFetchTimezones={onFetchTimezones}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
		expect(onFetchUserFacebookAccounts).toHaveBeenCalledTimes(1);
	});

	it("Test UserSettings component without timezones", () => {
		expect(onFetchTimezones).toHaveBeenCalledTimes(0);
		wrapper = mount(
			<UserSettings
				user={user}
				facebookAccounts={facebookAccounts}
				loading={false}
				onUpdateUserSettings={updateUserSettingsMock}
				onFetchUserFacebookAccounts={onFetchUserFacebookAccounts}
				onDeauthorizeFacebookAccount={onDeauthorizeFacebookAccountMock}
				onDeauthorizeInstagramAccount={onDeauthorizeInstagramAccountMock}
				onClose={onCloseMock}
				timezones={null}
				onFetchTimezones={onFetchTimezones}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
		expect(onFetchTimezones).toHaveBeenCalledTimes(1);
	});

	it("Test save user settings button handler when no changes", () => {
		wrapper.find('Button#settingsUserSaveButton').simulate('click');
		expect(updateUserSettingsMock).toHaveBeenCalledTimes(0);
	});

	it("Test save user settings button handler when changes", () => {
		wrapper.setProps({
			user: {
				settings: {
					language_code: 'es'
				}
			}
		});
		wrapper.find('Button#settingsUserSaveButton').simulate('click');
		expect(updateUserSettingsMock).toHaveBeenCalledTimes(1);
	});

	it("Test cancel button handler", () => {
		wrapper.find('Button#settingsUserCancelButton').simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
	});

	it("Test close (X) button handler", () => {
		wrapper.find('Button#userSettingsCloseButton').simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
	});

	it("Test facebookAccounts is loading", () => {
		wrapper.setProps({
			loading: true
		});
		expect(wrapper.find(CircularProgress)).toHaveLength(1);
		expect(wrapper.find('.settings-section')).toHaveLength(0);
	});

	it('Test new tenant index permissions', () => {
		const userWithoutPermissions: UserObject = {
			...user,
			permissions: []
		};

		// Mount again because user prop is assigned to state in constructor
		wrapper = mount(
			<UserSettings
				user={userWithoutPermissions}
				facebookAccounts={facebookAccounts}
				loading={false}
				onUpdateUserSettings={updateUserSettingsMock}
				onFetchUserFacebookAccounts={onFetchUserFacebookAccounts}
				onDeauthorizeFacebookAccount={onDeauthorizeFacebookAccountMock}
				onDeauthorizeInstagramAccount={onDeauthorizeInstagramAccountMock}
				onClose={onCloseMock}
				timezones={timezones}
				onFetchTimezones={onFetchTimezones}
			/>
		);
		expect(wrapper.find('SelectionControl#settingsUserSelectionControl')).toHaveLength(0);
	});

	it('Test change language input', () => {
		expect(wrapper.state().user.settings.language_code).toStrictEqual('en');
		wrapper.find("#settingsUserLanguageSelect").at(0).props().onChange("es");
		expect(wrapper.state().user.settings.language_code).toStrictEqual('es');
	});

	it('Test change locale', () => {
		expect(wrapper.state().user.settings.locale).toStrictEqual('en-GB');
		wrapper.find("#settingsUserLocaleSelect").at(0).props().onChange("es-ES");
		expect(wrapper.state().user.settings.locale).toStrictEqual('es-ES');
	});

	it('Test change time zone', () => {
		expect(wrapper.state().user.settings.timezone).toStrictEqual('UTC');
		wrapper.find("#settingsUserTimezoneSelect").at(0).props().onChange("Europe/Madrid");
		expect(wrapper.state().user.settings.timezone).toStrictEqual('Europe/Madrid');
	});

	it("Test click deauthorize facebook event handler", () => {
		wrapper.find('.facebook-account button').simulate('click');
		expect(onDeauthorizeFacebookAccountMock).toHaveBeenCalled();
	});

	it("Test click deauthorize instagram event handler", () => {
		wrapper.find('.instagram-account button').simulate('click');
		wrapper.find('button#launchmetricsDialogAcceptBtn').simulate('click'); // Dialog accept
		expect(onDeauthorizeInstagramAccountMock).toHaveBeenCalled();
	});

	it("Test deauthorize instagram dialog opened but cancelled", () => {
		wrapper.find('.instagram-account button').simulate('click');
		wrapper.find('button#launchmetricsDialogCancelBtn').simulate('click'); // Dialog accept
		expect(wrapper.html()).toMatchSnapshot();
	});
});
