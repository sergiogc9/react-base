import React from "react";
import { shallow, mount } from "enzyme";

import { FocusObject } from "@src/class/Focus";

import FocusFeedDuplicateFeedDialog from "@src/components/Focus/Feed/DuplicateFeedDialog/FocusFeedDuplicateFeedDialog";

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

describe("FocusFeedDuplicateFeedDialog", () => {
	let wrapper: any;
	let onDuplicateFeedStart = jest.fn();
	let onToggleShowDuplicateFeed = jest.fn();

	const getComponent = () => <FocusFeedDuplicateFeedDialog
		focusList={focusList}
		focusId="focus-id"
		feedName="feed-name"
		loadingDuplicatedFeed={false}
		duplicatedFeedId={null}
		onDuplicateFeedStart={onDuplicateFeedStart}
		onToggleShowDuplicateFeed={onToggleShowDuplicateFeed}
	/>;

	beforeEach(() => {
		onDuplicateFeedStart = jest.fn();
		onToggleShowDuplicateFeed = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with focusList null", () => {
		wrapper.setProps({ focusList: null });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with loading duplicated feed", () => {
		wrapper.setProps({ loadingDuplicatedFeed: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with duplicated feed id", () => {
		wrapper.setProps({ duplicatedFeedId: "dup-feed-id" });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component feed name change event", () => {
		wrapper = mount(getComponent());
		wrapper.find('#focusFeedDuplicateFeedDialogFeedName').at(0).props().onChange("new-feed-name");
		expect(wrapper.state().editedFeedName).toEqual("new-feed-name");
	});

	it("Component focus select change event", () => {
		wrapper = mount(getComponent());
		wrapper.find('#focusFeedDuplicateFeedDialogFocusSelect').at(0).props().onChange("selected-focus-id");
		expect(wrapper.state().selectedFocusId).toEqual("selected-focus-id");
	});

	it("Component focus cancel button handler", () => {
		wrapper = mount(getComponent());
		wrapper.find('#launchmetricsDialogCancelBtn').at(0).simulate('click');
		expect(onToggleShowDuplicateFeed).toHaveBeenCalledTimes(1);
	});

	it("Component focus accept button handler to start duplicating the feed", () => {
		wrapper = mount(getComponent());
		wrapper.find('#launchmetricsDialogAcceptBtn').at(0).simulate('click');
		expect(onDuplicateFeedStart).toHaveBeenCalledTimes(1);
	});

	it("Component focus accept button handler to close dialog", () => {
		wrapper = mount(getComponent());
		wrapper.setProps({ duplicatedFeedId: "dup-feed-id" });
		wrapper.find('#launchmetricsDialogAcceptBtn').at(0).simulate('click');
		expect(onToggleShowDuplicateFeed).toHaveBeenCalledTimes(1);
	});

});
