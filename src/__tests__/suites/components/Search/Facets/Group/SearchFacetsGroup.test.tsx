import { shallow } from "enzyme";
import React from "react";
import { RouterState } from "react-router-redux";

import SearchFacetsGroup from "@src/components/Search/Facets/Group/SearchFacetsGroup";
import GA from '@src/lib/googleAnalytics';
import { FacetItem } from "@src/class/Facet";
import { FiltersFacetGroup } from "@src/class/Filter";
import { Facet } from '@src/class/Facet';

const facetItems: FacetItem[] = [{ key: "24", counter: 22 }, { key: "30", counter: 50 }];
const facetItemsTags: FacetItem[] = [{ key: "tag1", counter: 10 }, { key: "tag2", counter: 20 }];
const mediaItemsTags: FacetItem[] = [{ key: "22222", counter: 100, name: "media 2", type: "news" }, { key: "11111", counter: 20, name: "media 1", type: "print" }];
const languageItemsTags: FacetItem[] = [{ key: "127", counter: 1 }];

const facetsFiltersGroups: FiltersFacetGroup = {
	"channel_type_id": [{ key: "24" }],
	"tenants.tags": [{ key: "tag1" }],
	"media_id": [{ key: "333333", name: "Media 3", type: "news" }]
};

const routerLocation: RouterState["location"] = {
	pathname: "/article",
	search: "",
	state: "",
	hash: ""
};

let onToggleFacetFilter: any;
let onRemoveFacetFilterGroup: any;
let onToggleFacetGroupOpened: any;
let onSetShowMoreDialogFacetGroupKey: any;

describe("<SearchFacetsGroup />", () => {
	let wrapper: any;

	beforeAll(() => {
		window.matchMedia = jest.fn((query: string) => ({
			matches: query.indexOf('(min-width: 1025px)') !== -1
		}));
	});

	beforeEach(() => {
		onToggleFacetFilter = jest.fn();
		onRemoveFacetFilterGroup = jest.fn();
		onToggleFacetGroupOpened = jest.fn();
		onSetShowMoreDialogFacetGroupKey = jest.fn();
		wrapper = shallow(<SearchFacetsGroup
			location={routerLocation}
			feedType={null}
			facetFilters={facetsFiltersGroups}
			facetsGroupsOpened={["channel_type_id", "tenants.tags"]}
			onToggleFacetFilter={onToggleFacetFilter}
			onRemoveFacetFilterGroup={onRemoveFacetFilterGroup}
			onToggleFacetGroupOpened={onToggleFacetGroupOpened}
			onSetShowMoreDialogFacetGroupKey={onSetShowMoreDialogFacetGroupKey}
			groupKey="channel_type_id"
			groupItems={facetItems}
			loadingFacets={false}
		/>);
	});

	it("Test component snapshot with group opened", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with group not opened", () => {
		wrapper.setProps({ facetsGroupsOpened: [] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with not filter enabled", () => {
		wrapper.setProps({ facetFilters: {} });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with group not enabled", () => {
		wrapper.setProps({ groupItems: [], facetFilters: {} });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with tenants.tags group", () => {
		wrapper.setProps({ groupKey: "tenants.tags", groupItems: facetItemsTags });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with media_id group", () => {
		wrapper.setProps({ groupKey: "media_id", groupItems: mediaItemsTags });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Test component snapshot with language.id group", () => {
		wrapper.setProps({ groupKey: "language.id", groupItems: languageItemsTags });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with a facet filtered not received by query", () => {
		wrapper.setProps({ groupItems: [] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot in preview page with group without tooltip and feed online", () => {
		wrapper.setProps({ feedType: "online", location: { ...routerLocation, pathname: "/focus/focusId/feed/create/socialmedia" } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot in preview page with group without tooltip", () => {
		wrapper.setProps({ feedType: "socialmedia", location: { ...routerLocation, pathname: "/focus/focusId/feed/create/socialmedia" } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot in preview page with language group key", () => {
		wrapper.setProps({ groupKey: "language_id", feedType: "socialmedia", location: { ...routerLocation, pathname: "/focus/focusId/feed/create/socialmedia" } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot in preview page with country group key", () => {
		wrapper.setProps({ groupKey: "country_path", feedType: "socialmedia", location: { ...routerLocation, pathname: "/focus/focusId/feed/create/socialmedia" } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test group item checkbox change event", () => {
		GA.trackEvent = jest.fn();
		expect(onToggleFacetFilter).toHaveBeenCalledTimes(0);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsGroupItemCheckbox-channel_type_id-24').at(0).props().onChange();
		expect(onToggleFacetFilter).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
		wrapper.find('#searchFacetsGroupItemName-channel_type_id-24').at(0).simulate('click');
		expect(onToggleFacetFilter).toHaveBeenCalledTimes(2);
		expect(GA.trackEvent).toHaveBeenCalledTimes(2);
	});

	it("Test toggle group opened handler with group enabled", () => {
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsGroup-channel_type_id .search-facets-group-header').at(0).simulate('click');
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(1);
	});

	it("Test toggle group opened handler with group disabled", () => {
		wrapper.setProps({ groupItems: [], facetFilters: {} });
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsGroup-channel_type_id .search-facets-group-header').at(0).simulate('click');
		expect(onToggleFacetGroupOpened).toHaveBeenCalledTimes(0);
	});

	it("Test remove group enabled filters handler", () => {
		expect(onRemoveFacetFilterGroup).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsGroup-channel_type_id .search-facets-group-remove-filters').at(0).simulate('click');
		expect(onRemoveFacetFilterGroup).toHaveBeenCalledTimes(1);
	});

	it("Test on set show more dialog click handler", () => {
		GA.trackEvent = jest.fn();
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(0);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsGroupSetShowMore-channel_type_id').at(0).simulate('click');
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test untagged document tag special render", () => {
		const newTagItems = [{ key: Facet.untaggedDocumentKey, counter: 10 }];
		wrapper.setProps({ groupKey: "tenants.tags", groupItems: newTagItems });
		expect(wrapper.find('.search-facets-group-item-name .custom-facet').exists()).toBe(true);
	});

	it("Test facet counters should not be displayed while loading facets", () => {
		expect(wrapper.find(".counter").exists()).toEqual(true);
		wrapper.setProps({ loadingFacets: true });
		expect(wrapper.find(".counter").exists()).toEqual(false);
	});
});
