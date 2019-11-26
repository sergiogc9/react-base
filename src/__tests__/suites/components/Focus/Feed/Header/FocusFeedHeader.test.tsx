import React from "react";
import { shallow, mount } from "enzyme";

import { FocusObject } from "@src/class/Focus";
import FocusFeedHeader from "@src/components/Focus/Feed/Header/FocusFeedHeader";

const focus: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: { online: [], socialmedia: [], print: [] },
	id: "focus-id-1",
	inserted_at: new Date(1549287550563),
	name: "focus-name-1",
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url.com",
	acl_users: [
		{
			user_id: 'fake-user-id-1',
			discover_role: 'viewer',
			last_name: "Name",
			first_name: "User"
		},
		{
			user_id: 'fake-user-id-2',
			discover_role: 'viewer',
			last_name: 'User 2',
			first_name: 'Name 2'
		}
	]
};

const focus2: FocusObject = {
	...focus,
	id: "focus-id-2",
	name: "focus-name-2",
};

const focusList: FocusObject[] = [focus, focus2];

describe("FocusFeedHeader", () => {
	let wrapper: any;
	let onSaveFeed = jest.fn();
	let onSaveFeedName = jest.fn();
	let onSetEditNameInputValue = jest.fn();
	let onToggleFeedEnabled = jest.fn();
	let onToggleDrawer = jest.fn();
	let onDuplicateFeed = jest.fn();

	const getComponent = () => <FocusFeedHeader
		focusList={focusList}
		focusId={focus.id}
		feedId="feed-id"
		feedName="feed-name"
		feedType="socialmedia"
		feedEnabled={true}
		editNameInputValue={null}
		loadingSaveFeedName={false}
		feedChanged={false}
		showDuplicateFeedDialog={false}
		loadingSaveFeed={false}
		onSaveFeed={onSaveFeed}
		onSaveFeedName={onSaveFeedName}
		onSetEditNameInputValue={onSetEditNameInputValue}
		onToggleDrawer={onToggleDrawer}
		onToggleFeedEnabled={onToggleFeedEnabled}
		onDuplicateFeed={onDuplicateFeed}
	/>;

	beforeEach(() => {
		onSaveFeed = jest.fn();
		onSaveFeedName = jest.fn();
		onSetEditNameInputValue = jest.fn();
		onToggleFeedEnabled = jest.fn();
		onToggleDrawer = jest.fn();
		onDuplicateFeed = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot while fetching data", () => {
		wrapper.setProps({ feedType: null });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with show feed duplicate dialog", () => {
		wrapper.setProps({ showDuplicateFeedDialog: true });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with save feed loading", () => {
		wrapper.setProps({ loadingSaveFeed: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Toggle drawer reponsive click", () => {
		wrapper.find('#focusFeedToggleDrawerBtn').at(0).simulate('click');
		expect(onToggleDrawer).toHaveBeenCalledTimes(1);
	});

	it("Component snapshot with edit name loading", () => {
		wrapper.setProps({ loadingSaveFeedName: true });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('CircularProgress')).toHaveLength(1);
	});

	it("Component with edit name enabled", () => {
		wrapper.setState({ editNameEnabled: true });
		wrapper.setProps({ editNameInputValue: "name" });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component toggle edit name enabled handler", () => {
		wrapper.find('.edit-name-handler').at(0).simulate('click');
		expect(wrapper.state().editNameEnabled).toBe(true);
	});

	it("Component edit name input change event", () => {
		wrapper.setState({ editNameEnabled: true });
		wrapper.find('#focusFeedHeaderEditName').at(0).props().onChange("new text");
		expect(onSetEditNameInputValue).toHaveBeenCalledTimes(1);
		expect(onSetEditNameInputValue).toHaveBeenCalledWith("new text");
	});

	it("Component save feed click handlers", () => {
		wrapper = mount(getComponent());
		wrapper.setProps({ feedChanged: true });
		expect(onSaveFeed).toHaveBeenCalledTimes(0);
		wrapper.find('#focusFeedHeaderSaveFeedBtn').at(0).simulate('click');
		expect(onSaveFeed).toHaveBeenCalledTimes(1);
		wrapper.find('#focusFeedHeaderShowDrowpdownMenuResponsiveBtn').at(0).simulate('click');
		wrapper.find('div#focusFeedHeaderDropdownMenuResponsiveSaveFeed').at(0).simulate('click');
		expect(onSaveFeed).toHaveBeenCalledTimes(2);
	});

	it("Component edit name input blur event", () => {
		wrapper.setState({ editNameEnabled: true });
		wrapper.find('#focusFeedHeaderEditName').at(0).simulate('blur');
		expect(onSaveFeedName).toHaveBeenCalledTimes(1);
		expect(wrapper.state().editNameEnabled).toBe(false);
	});

	it("Component on enter key event", () => {
		wrapper.setState({ editNameEnabled: true });
		wrapper.find('#focusFeedHeaderEditName').at(0).simulate('keydown', { keyCode: 13 });
		expect(onSaveFeedName).toHaveBeenCalledTimes(1);
		expect(wrapper.state().editNameEnabled).toBe(false);
	});

	it("Component on other key event", () => {
		wrapper.setState({ editNameEnabled: true });
		wrapper.find('#focusFeedHeaderEditName').at(0).simulate('keydown', { keyCode: 10 });
		expect(onSaveFeedName).toHaveBeenCalledTimes(0);
		expect(wrapper.state().editNameEnabled).toBe(true);
	});

	it("Component snapshot with feed disabled", () => {
		wrapper.setProps({ feedEnabled: false });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on toggle feed enabled", () => {
		wrapper.setState({ editNameEnabled: true });
		wrapper.find('#focusFeedHeaderToggleFeedEnabled').at(0).props().onChange();
		expect(onToggleFeedEnabled).toHaveBeenCalledTimes(1);
	});

	it("Component on toggle feed enabled in responsive menu", () => {
		wrapper = mount(getComponent());
		wrapper.find('button#focusFeedHeaderShowDrowpdownMenuResponsiveBtn').at(0).simulate('click');
		wrapper.find('div#focusFeedHeaderDropdownMenuResponsiveToggleEnableFeed').at(0).simulate('click');
		expect(onToggleFeedEnabled).toHaveBeenCalledTimes(1);
	});

	it("Component on duplicate button click handler", () => {
		wrapper = mount(getComponent());
		wrapper.find('button#focusFeedHeaderShowDrowpdownMenuBtn').at(0).simulate('click');
		wrapper.find('div#focusFeedHeaderDropdownMenuDuplicateFeed').at(0).simulate('click');
		expect(onDuplicateFeed).toHaveBeenCalledTimes(1);
	});

	it("Component focus on name input", () => {
		wrapper = mount(getComponent());
		wrapper.setState({ editNameEnabled: true });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});
});
