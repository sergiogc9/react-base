import React from "react";
import { shallow } from "enzyme";

import { FocusObject } from "@src/class/Focus";
import FocusFeed from "@src/components/Focus/Feed/FocusFeed";

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

describe("FocusFeed", () => {
	let wrapper: any;
	let onFetchFocusListMock = jest.fn();
	let onResetFeedMock = jest.fn();
	let onFetchFeedMock = jest.fn();

	beforeEach(() => {
		onFetchFocusListMock = jest.fn();
		onResetFeedMock = jest.fn();
		onFetchFeedMock = jest.fn();
		wrapper = shallow(<FocusFeed
			isCreatePage={true}
			urlFocusId={focus.id}
			urlFeedType="online"
			focusList={focusList}
			feedType={null}
			loadingSaveFeed={false}
			onFetchFocusList={onFetchFocusListMock}
			onResetFeed={onResetFeedMock}
			onFetchFeed={onFetchFeedMock}
		/>);
	});

	it("Online feed reseting feed", () => {
		wrapper = shallow(<FocusFeed
			isCreatePage={false}
			urlFocusId={focus.id}
			urlFeedId="feed-id"
			focusList={null}
			feedType="online"
			loadingSaveFeed={false}
			onFetchFocusList={onFetchFocusListMock}
			onResetFeed={onResetFeedMock}
			onFetchFeed={onFetchFeedMock}
		/>);
		expect(wrapper.debug()).toMatchSnapshot();
		expect(wrapper.find('CircularProgress')).toHaveLength(1);
		expect(onFetchFeedMock).toHaveBeenCalledTimes(1);
		expect(onFetchFeedMock).toHaveBeenCalledWith(focus.id, "feed-id");
	});

	it("Online feed fetching feed", () => {
		expect(wrapper.debug()).toMatchSnapshot();
		expect(wrapper.find('CircularProgress')).toHaveLength(1);
		expect(onResetFeedMock).toHaveBeenCalledTimes(1);
	});

	it("Create page without focus list not reseting feed", () => {
		onResetFeedMock = jest.fn();
		wrapper = shallow(<FocusFeed
			isCreatePage={true}
			urlFocusId={focus.id}
			focusList={null}
			feedType="online"
			loadingSaveFeed={false}
			onFetchFocusList={onFetchFocusListMock}
			onResetFeed={onResetFeedMock}
			onFetchFeed={onFetchFeedMock}
		/>);
		expect(onResetFeedMock).toHaveBeenCalledTimes(0);
	});

	it("Create page without focus list reset feed after changing focus list props", () => {
		onResetFeedMock = jest.fn();
		wrapper = shallow(<FocusFeed
			isCreatePage={true}
			urlFocusId={focus.id}
			focusList={null}
			feedType="online"
			loadingSaveFeed={false}
			onFetchFocusList={onFetchFocusListMock}
			onResetFeed={onResetFeedMock}
			onFetchFeed={onFetchFeedMock}
		/>);
		expect(onResetFeedMock).toHaveBeenCalledTimes(0);
		wrapper.setProps({ focusList });
		expect(onResetFeedMock).toHaveBeenCalledTimes(1);
	});

	it("Create page without focus list not cal reset feed after changing focus list props", () => {
		onResetFeedMock = jest.fn();
		wrapper = shallow(<FocusFeed
			isCreatePage={true}
			urlFocusId="non-existing-focus"
			focusList={null}
			feedType="online"
			loadingSaveFeed={false}
			onFetchFocusList={onFetchFocusListMock}
			onResetFeed={onResetFeedMock}
			onFetchFeed={onFetchFeedMock}
		/>);
		expect(onResetFeedMock).toHaveBeenCalledTimes(0);
		wrapper.setProps({ focusList });
		expect(onResetFeedMock).toHaveBeenCalledTimes(0);
	});

	it("Online feed without focus list", () => {
		wrapper = shallow(<FocusFeed
			isCreatePage={true}
			urlFocusId={focus.id}
			focusList={null}
			feedType="online"
			loadingSaveFeed={false}
			onFetchFocusList={onFetchFocusListMock}
			onResetFeed={onResetFeedMock}
			onFetchFeed={onFetchFeedMock}
		/>);
		expect(wrapper.debug()).toMatchSnapshot();
		expect(wrapper.find('CircularProgress')).toHaveLength(1);
		expect(onFetchFocusListMock).toHaveBeenCalledTimes(1);
	});

	it("Online create feed component snapshot", () => {
		wrapper.setProps({ urlFeedType: "online", feedType: "online" });
		expect(wrapper.debug()).toMatchSnapshot();
		expect(onFetchFocusListMock).toHaveBeenCalledTimes(0);
	});

	it("Social create feed component snapshot", () => {
		wrapper.setProps({ urlFeedType: "socialmedia", feedType: "socialmedia" });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Print create feed component snapshot", () => {
		wrapper = shallow(<FocusFeed
			isCreatePage={true}
			urlFocusId={focus.id}
			focusList={null}
			feedType="print_percolator"
			loadingSaveFeed={false}
			onFetchFocusList={onFetchFocusListMock}
			onResetFeed={onResetFeedMock}
			onFetchFeed={onFetchFeedMock}
		/>);
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Online existing feed component snapshot", () => {
		wrapper.setProps({ urlFeedType: null, feedType: "online" });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Social existing feed component snapshot", () => {
		wrapper.setProps({ urlFeedType: null, feedType: "socialmedia" });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Print existing feed component snapshot", () => {
		wrapper.setProps({ urlFeedType: null, feedType: "print_percolator" });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with save feed loading", () => {
		wrapper.setProps({ loadingSaveFeed: true });
		expect(wrapper.debug()).toMatchSnapshot();
	});

});
