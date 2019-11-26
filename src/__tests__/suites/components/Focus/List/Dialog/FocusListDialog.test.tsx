import React from 'react';
import { mount } from 'enzyme';

import FocusListDialog from '@src/components/Focus/List/Dialog/FocusListDialog';
import { FeedObject } from '@src/class/Feed';
import { FocusObject, FocusFeeds } from '@src/class/Focus';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const document = TestHelper.getDocument();

const feed: FeedObject = {
	definition: {},
	deleted_at: new Date(1549287550563),
	enabled: true,
	filters: {},
	focus_id: "focus-id-1",
	id: "feed-id-1",
	inserted_at: new Date(1549287550563),
	name: "feed-name-1",
	oldest_document: document,
	type: "online",
	updated_at: new Date(1549287550563)
};

const feed2: FeedObject = {
	...feed,
	id: "feed-id-2",
	name: "feed-name-2",
	type: "socialmedia",
};

const focusFeeds: FocusFeeds = {
	online: [feed],
	socialmedia: [feed2],
	print: []
};

const focus: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: focusFeeds,
	id: "focus-id-1",
	inserted_at: new Date(1549287550563),
	name: "focus-name-1",
	oldest_document: document,
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url.com"
};

let onCloseMock: jest.Mock;
let onCreateMock: jest.Mock;
let onRenameMock: jest.Mock;
let onRemoveMock: jest.Mock;
let onRemoveFeedMock: jest.Mock;

describe('<FocusListDialog />', () => {
	let wrapper: any;

	beforeEach(() => {
		onCloseMock = jest.fn();
		onCreateMock = jest.fn();
		onRenameMock = jest.fn();
		onRemoveMock = jest.fn();
		onRemoveFeedMock = jest.fn();
		wrapper = mount((<FocusListDialog
			action="createFocus"
			focus={focus}
			feed={null}
			onClose={onCloseMock}
			onCreateFocus={onCreateMock}
			onRemoveFocus={onRemoveMock}
			onRenameFocus={onRenameMock}
			onRemoveFeed={onRemoveFeedMock}
		></FocusListDialog>));
		jest.useFakeTimers();
	});

	it("Test FocusListDialog snapshot creating a focus", () => {
		wrapper = mount((<FocusListDialog
			action="createFocus"
			focus={focus}
			feed={null}
			onClose={onCloseMock}
			onCreateFocus={onCreateMock}
			onRemoveFocus={onRemoveMock}
			onRenameFocus={onRenameMock}
			onRemoveFeed={onRemoveFeedMock}
		></FocusListDialog>));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test FocusListDialog snapshot renaming a focus", () => {
		wrapper = mount((<FocusListDialog
			action="renameFocus"
			focus={focus}
			feed={null}
			onClose={onCloseMock}
			onCreateFocus={onCreateMock}
			onRemoveFocus={onRemoveMock}
			onRenameFocus={onRenameMock}
			onRemoveFeed={onRemoveFeedMock}
		></FocusListDialog>));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test FocusListDialog snapshot removing a focus", () => {
		wrapper = mount((<FocusListDialog
			action="removeFocus"
			focus={focus}
			feed={null}
			onClose={onCloseMock}
			onCreateFocus={onCreateMock}
			onRemoveFocus={onRemoveMock}
			onRenameFocus={onRenameMock}
			onRemoveFeed={onRemoveFeedMock}
		></FocusListDialog>));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test FocusListDialog snapshot removing a feed", () => {
		wrapper = mount((<FocusListDialog
			action="removeFocus"
			focus={focus}
			feed={feed}
			onClose={onCloseMock}
			onCreateFocus={onCreateMock}
			onRemoveFocus={onRemoveMock}
			onRenameFocus={onRenameMock}
			onRemoveFeed={onRemoveFeedMock}
		></FocusListDialog>));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test FocusListDialog should show error", () => {
		expect(wrapper.find('#focusListSimpleDialog .md-text--error')).toHaveLength(0);
		wrapper.setState({ dialogInputError: "fake_error" });
		expect(wrapper.find('#focusListSimpleDialog .md-text--error')).toHaveLength(2);
	});

	it("Test FocusListDialog should call onClose", () => {
		wrapper.find('Button#launchmetricsDialogCancelBtn').simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
	});

	it("Test FocusListDialog should call onDialogAccepted in each action case", () => {
		expect(onCreateMock).toHaveBeenCalledTimes(0);
		expect(onRenameMock).toHaveBeenCalledTimes(0);
		expect(onRemoveMock).toHaveBeenCalledTimes(0);
		wrapper.find('input#focusListCreateFocusInput').simulate('change', { target: { value: 'Focus name' } });
		wrapper.find('Button#launchmetricsDialogAcceptBtn').simulate('click');
		expect(onCreateMock).toHaveBeenCalledTimes(1);
		wrapper.setProps({ action: "renameFocus" });
		wrapper.find('input#focusListRenameFocusInput').simulate('change', { target: { value: 'Focus name' } });
		wrapper.find('Button#launchmetricsDialogAcceptBtn').simulate('click');
		expect(onRenameMock).toHaveBeenCalledTimes(1);
		wrapper.setProps({ action: "removeFocus" });
		wrapper.find('Button#launchmetricsDialogAcceptBtn').simulate('click');
		expect(onRemoveMock).toHaveBeenCalledTimes(1);
		wrapper.setProps({ action: "removeFeed" });
		wrapper.find('Button#launchmetricsDialogAcceptBtn').simulate('click');
		expect(onRemoveFeedMock).toHaveBeenCalledTimes(1);
	});

	it("Test FocusListDialog should call onDialogAccepted with error (empty input)", () => {
		expect(wrapper.state().dialogInputError).toBe(null);
		wrapper.find('Button#launchmetricsDialogAcceptBtn').simulate('click');
		expect(wrapper.state().dialogInputError).not.toBe(null);
		wrapper.setProps({ action: "renameFocus" });
		wrapper.find('Button#launchmetricsDialogAcceptBtn').simulate('click');
		expect(wrapper.state().dialogInputError).not.toBe(null);
	});
});
