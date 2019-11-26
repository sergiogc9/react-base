import { shallow } from "enzyme";
import React from "react";
import SearchFacetsFeedsGroup from "@src/components/Search/Facets/FeedsGroup/SearchFacetsFeedsGroup";
import GA from '@src/lib/googleAnalytics';
import { FeedObject } from "@src/class/Feed";
import { FocusFeeds, FocusObject } from "@src/class/Focus";
import { FocusFeedsGroupKey } from "@src/types/search/form";
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const document = TestHelper.getDocument();

const feedOnline: FeedObject = {
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

const feedSocial: FeedObject = {
	...feedOnline,
	id: "feed-id-2",
	name: "feed-name-2",
	type: "socialmedia",
};

const feedPrint: FeedObject = {
	...feedOnline,
	id: "feed-id-3",
	name: "feed-name-3",
	type: "print",
};

const focusFeeds: FocusFeeds = {
	online: [feedOnline],
	socialmedia: [feedSocial],
	print: [feedPrint]
};

const focus: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: focusFeeds,
	id: "focus-id-1",
	inserted_at: new Date(1549287550563),
	name: "focus-name-1",
	oldest_document: document,
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url.com",
};

const focusList: FocusObject[] = [focus];

let onToggleFacetGroupOpened: any;
let onToggleFeedFiltered: any;
let onToggleFocusFiltered: any;
let onRemoveFocusFeedFilter: any;

describe("<SearchFacetsFeedsGroup />", () => {
	let wrapper: any;

	beforeAll(() => {
		window.matchMedia = jest.fn((query: string) => ({
			matches: query.indexOf('(min-width: 1025px)') !== -1,
		}));
	});

	beforeEach(() => {
		onToggleFacetGroupOpened = jest.fn();
		onToggleFeedFiltered = jest.fn();
		onToggleFocusFiltered = jest.fn();
		onRemoveFocusFeedFilter = jest.fn();
		wrapper = shallow(<SearchFacetsFeedsGroup
			focusList={focusList}
			focusFiltered={[]}
			feedsFiltered={[]}
			facetsGroupsOpened={[FocusFeedsGroupKey]}
			onToggleFacetGroupOpened={onToggleFacetGroupOpened}
			onToggleFeedFiltered={onToggleFeedFiltered}
			onToggleFocusFiltered={onToggleFocusFiltered}
			onRemoveFocusFeedFilter={onRemoveFocusFeedFilter}
		/>);
	});

	it("Test component snapshot with focus list not loaded", () => {
		wrapper.setProps({ focusList: null });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with group closed", () => {
		wrapper.setProps({ facetsGroupsOpened: [] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with group opened and no filters enabled", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with group disabled (no focus)", () => {
		wrapper.setProps({ focusList: [] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with focus filtered", () => {
		wrapper.setProps({ focusFiltered: [focus.id] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with a feed filtered", () => {
		wrapper.setProps({ feedsFiltered: [feedOnline.id] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test toggle focus filtered checkbox handler", () => {
		GA.trackEvent = jest.fn();
		expect(onToggleFocusFiltered).toHaveBeenCalledTimes(0);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find(`#searchFacetsFeedsGroupItemCheckbox-focus-${focus.id}`).at(0).props().onChange();
		expect(onToggleFocusFiltered).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
		wrapper.find(`#searchFacetsFeedsGroupItemName-focus-${focus.id}`).at(0).simulate('click');
		expect(onToggleFocusFiltered).toHaveBeenCalledTimes(2);
		expect(GA.trackEvent).toHaveBeenCalledTimes(2);
	});

	it("Test toggle feed filtered checkbox handler", () => {
		GA.trackEvent = jest.fn();
		expect(onToggleFeedFiltered).toHaveBeenCalledTimes(0);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find(`#searchFacetsFeedsGroupItemCheckbox-feed-${feedOnline.id}`).at(0).props().onChange();
		expect(onToggleFeedFiltered).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
		wrapper.find(`#searchFacetsFeedsGroupItemName-feed-${feedOnline.id}`).at(0).simulate('click');
		expect(onToggleFeedFiltered).toHaveBeenCalledTimes(2);
		expect(GA.trackEvent).toHaveBeenCalledTimes(2);
	});

	it("Test toggle group opened with group enabled (focus available)", () => {
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(0);
		wrapper.find(`#searchFacetsFeedsGroup-focus .search-facets-group-header`).at(0).simulate('click');
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(1);
	});

	it("Test toggle group opened with group disabled (no focus)", () => {
		wrapper.setProps({ focusList: [] });
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(0);
		wrapper.find(`#searchFacetsFeedsGroup-focus .search-facets-group-header`).at(0).simulate('click');
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(0);
	});

	it("Test remove all focus and feeds filtered", () => {
		wrapper.setProps({ focusFiltered: [focus.id] });
		expect(onRemoveFocusFeedFilter).toHaveBeenCalledTimes(0);
		wrapper.find(`#searchFacetsFeedsGroup-focus .search-facets-group-remove-filters`).at(0).simulate('click');
		expect(onRemoveFocusFeedFilter).toHaveBeenCalledTimes(1);
	});
});
