import { mount } from "enzyme";
import React from "react";
import SearchFacetsDialog from "@src/components/Search/Facets/Dialog/SearchFacetsDialog";
import { FacetItemsGroup, FacetObject, Facet } from "@src/class/Facet";
import { FiltersFacetGroup } from "@src/class/Filter";
import { FacetItemHash } from "@src/store/search/facets/extended";
import { TreeUtils } from "@src/class/Tree";
import GA from '@src/lib/googleAnalytics';

const facetsFiltersGroups: FiltersFacetGroup = {
	"channel_type_id": [{ key: "24" }],
	"tenants.tags": [{ key: "tag1" }]
};

const facetsGroups: FacetItemsGroup = {
	"channel_type_id": [{ key: "24", counter: 22 }],
	"language_id": [{ key: "127", counter: 250 }],
	"country_path": [{ key: "01", counter: 30 }, { key: "0105", counter: 3 }, { key: "0135", counter: 50 }, { key: "06", counter: 100 }],
	"tenants.categories_id": [{ key: "01", counter: 30 }, { key: "0106", counter: 36 }, { key: "010608", counter: 21 }, { key: "05", counter: 5 }],
	"tenants.tags": [{ key: "tag1", counter: 20 }, { key: "tag2", counter: 40 }],
	"media_id": [{ key: "111111", counter: 30, name: "Media 1", detail: "http://media1.com" }, { key: "222222", counter: 100, name: "Media 2", detail: "http://media2.com" }]
};

const facets: FacetObject = {
	groups: facetsGroups
};

let onSetShowMoreDialogFacetGroupKey: any;
let onSetGroupFacetsFilters: any;
let onFetchFacetsGroup: any;
let onSetAllState: any;
let onToggleCollapseAll: any;
let onToggleSeeOnlySelected: any;
let onToggleItemCollapsed: any;
let onToggleSelectedAll: any;
let onToggleSelectedFilter: any;
let onSetFilterText: any;
let onFetchQueriedMedias: any;

jest.useFakeTimers();

// tslint:disable:max-line-length
Facet.categoriesFacetValues = ['01', '0101', '010101', '010102', '04', '0401', '040101', '0402', '040201', '040202', '0403', '040301', '040302', '040303', '040304', '040305', '040306', '040307', '040308', '040309', '040310', '040311', '040312', '26', '2601', '260101', '260102', '260103', '260104', '260105', '260106', '2602', '260201', '260202', '260203', '2603', '260301', '260302', '260303', '260304'];
Facet.countryFacetValues = ['00', '01', '0100', '0101', '0102', '0103', '0104', '0105', '0106', '0107', '0108', '02', '0200', '0201', '0202', '0203', '0204', '0205', '0206'];
// tslint:enable:max-line-length

describe("<SearchFacetsDialog />", () => {
	let wrapper: any;

	beforeEach(() => {
		onSetShowMoreDialogFacetGroupKey = jest.fn();
		onSetGroupFacetsFilters = jest.fn();
		onFetchFacetsGroup = jest.fn();
		onSetAllState = jest.fn();
		onToggleCollapseAll = jest.fn();
		onToggleSeeOnlySelected = jest.fn();
		onToggleItemCollapsed = jest.fn();
		onToggleSelectedAll = jest.fn();
		onToggleSelectedFilter = jest.fn();
		onSetFilterText = jest.fn();
		onFetchQueriedMedias = jest.fn();
		wrapper = mount(<SearchFacetsDialog
			groupKey="channel_type_id"
			facets={null}
			facetFilters={facetsFiltersGroups}
			loadingFacetsGroup={false}
			facetItemsHash={{}}
			facetItems={{ rootNodes: [] }}
			seeOnlySelected={false}
			filterText=""
			queriedMedias={[]}
			onSetShowMoreDialogFacetGroupKey={onSetShowMoreDialogFacetGroupKey}
			onSetGroupFacetsFilters={onSetGroupFacetsFilters}
			onFetchFacetsGroup={onFetchFacetsGroup}
			onSetAllState={onSetAllState}
			onToggleCollapseAll={onToggleCollapseAll}
			onToggleItemCollapsed={onToggleItemCollapsed}
			onToggleSeeOnlySelected={onToggleSeeOnlySelected}
			onToggleSelectedAll={onToggleSelectedAll}
			onToggleSelectedFilter={onToggleSelectedFilter}
			onSetFilterText={onSetFilterText}
			onFetchQueriedMedias={onFetchQueriedMedias}
		/>);
	});

	it("Test component snapshot", () => {
		wrapper.setProps({ facets });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot when loading", () => {
		wrapper.setProps({ loadingFacetsGroup: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot whithout facets", () => {
		wrapper.setProps({ facets: { groups: {} } });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with tags group", () => {
		wrapper.setProps({ groupKey: "tenants.tags", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with country group", () => {
		wrapper.setProps({ groupKey: "country_path", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with language group", () => {
		wrapper.setProps({ groupKey: "language_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with medias", () => {
		wrapper.setProps({ groupKey: "media_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.setProps({
			facetItemsHash: {
				...facetItemsHash,
				111111: { ...facetItemsHash["111111"], selected: true }
			}
		});
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogAcceptBtn').at(0).simulate('click');
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(1);
	});

	it("Test component snapshot with medias with previous filters", () => {
		wrapper.setProps({ groupKey: "media_id", facets, facetFilters: { media_id: [{ key: "111111", name: "Media 1" }] } });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with medias with previous selected item in show more component", () => {
		const previousFacetItemHash: FacetItemHash = {
			222222: {
				node: { data: { value: "222222", text: "Media 2", counter: 0 } },
				collapsed: false,
				selected: true
			}
		};
		wrapper.setProps({ groupKey: "media_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, previousFacetItemHash);
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, previousFacetItemHash);
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component query medias while filtering", () => {
		wrapper.setProps({ groupKey: "media_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onSetFilterText).toHaveBeenCalledTimes(0);
		expect(onFetchQueriedMedias).toHaveBeenCalledTimes(0);
		expect(instance.filterInputTimeout).toBe(null);
		wrapper.find('#searchFacetsShowMoreDialogFilterInput').at(0).props().onChange('fakemedia');
		jest.runAllTimers();
		expect(onSetFilterText).toHaveBeenCalledTimes(1);
		expect(onFetchQueriedMedias).toHaveBeenCalledTimes(1);
		expect(onFetchQueriedMedias).toHaveBeenCalledWith("fakemedia");
		expect(instance.filterInputTimeout).not.toBe(null);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.find('#searchFacetsShowMoreDialogFilterInput').at(0).props().onChange('fakemedia2');
		jest.runAllTimers();
		expect(onSetFilterText).toHaveBeenCalledTimes(2);
		expect(onFetchQueriedMedias).toHaveBeenCalledTimes(2);
		expect(onFetchQueriedMedias).toHaveBeenCalledWith("fakemedia2");
		expect(instance.filterInputTimeout).not.toBe(null);
		wrapper.find('#searchFacetsShowMoreDialogFilterInput').at(0).props().onChange('');
	});

	it("Test component snapshot with medias filtered", () => {
		wrapper.setProps({ groupKey: "media_id", facets, filterText: "media1.com" });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with categories group", () => {
		wrapper.setProps({ groupKey: "tenants.categories_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with filtered tags", () => {
		wrapper.setProps({ groupKey: "tenants.tags", facets, filterText: "tag1" });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test overlay click should hide dialog", () => {
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(0);
		wrapper.find('.md-overlay').at(0).simulate('click');
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(1);
	});

	it("Test accept btn click should set filters and hide dialog", () => {
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(0);
		expect(onSetGroupFacetsFilters).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogAcceptBtn').at(0).simulate('click');
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(1);
		expect(onSetGroupFacetsFilters).toHaveBeenCalledTimes(1);
		expect(onSetGroupFacetsFilters).toHaveBeenCalledWith('channel_type_id', [{ key: "24", name: "filters.channel.24", detail: undefined }]);
	});

	it("Test cancel btn click should hide dialog", () => {
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogCancelBtn').at(0).simulate('click');
		expect(onSetShowMoreDialogFacetGroupKey).toHaveBeenCalledTimes(1);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test set all method called when facets updated", () => {
		expect(onSetAllState).toHaveBeenCalledTimes(0);
		wrapper.setProps({ groupKey: "country_path", facets });
		expect(onSetAllState).toHaveBeenCalledTimes(1);
	});

	it("Test collapse all btn click", () => {
		wrapper.setProps({ groupKey: "country_path", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onToggleCollapseAll).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogCollapseAllBtn').at(0).simulate('click');
		expect(onToggleCollapseAll).toHaveBeenCalledTimes(1);
		wrapper.setProps({
			facetItemsHash: {
				...facetItemsHash,
				"00": { ...facetItemsHash["00"], collapsed: true },
				"01": { ...facetItemsHash["01"], collapsed: true },
				"02": { ...facetItemsHash["02"], collapsed: true }
			}
		}); // Simulate store change
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test collapse item btn click", () => {
		wrapper.setProps({ groupKey: "tenants.categories_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
		expect(onToggleItemCollapsed).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogItem-0401-collapseBtn').at(0).simulate('click');
		expect(onToggleItemCollapsed).toHaveBeenCalledTimes(1);
		wrapper.setProps({ facetItemsHash: { ...facetItemsHash, "0401": { ...facetItemsHash["0401"], collapsed: true } } }); // Simulate store change
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test toggle selected filter item", () => {
		GA.trackEvent = jest.fn();
		wrapper.setProps({ groupKey: "tenants.categories_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onToggleSelectedFilter).toHaveBeenCalledTimes(0);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogCheckbox-0401').at(1).props().onChange();
		expect(onToggleSelectedFilter).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test toggle selected filter item with medias", () => {
		GA.trackEvent = jest.fn();
		wrapper.setProps({ groupKey: "media_id", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onToggleSelectedFilter).toHaveBeenCalledTimes(0);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogCheckbox-111111').at(1).props().onChange();
		expect(onToggleSelectedFilter).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test toggle selected filter item with tags", () => {
		GA.trackEvent = jest.fn();
		wrapper.setProps({ groupKey: "tenants.tags", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onToggleSelectedFilter).toHaveBeenCalledTimes(0);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogCheckbox-tag1').at(1).props().onChange();
		expect(onToggleSelectedFilter).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test toggle all filtered items checkbox", () => {
		wrapper.setProps({ groupKey: "country_path", facets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onToggleSelectedAll).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogSelectAll').at(0).props().onChange();
		expect(onToggleSelectedAll).toHaveBeenCalledTimes(1);
		wrapper.setProps({
			facetItemsHash: {
				...facetItemsHash,
				"00": { ...facetItemsHash["00"], selected: true },
				"01": { ...facetItemsHash["01"], selected: true },
				"02": { ...facetItemsHash["02"], selected: true }
			}
		}); // Simulate store change
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test toggle see only filtered", () => {
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
		expect(onToggleSeeOnlySelected).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogSeeOnlyFilteredBtn').at(0).simulate('click');
		expect(onToggleSeeOnlySelected).toHaveBeenCalledTimes(1);
		wrapper.setProps({ seeOnlySelected: true }); // Simulate store change
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test toggle see only filtered button disabled when no filters selected", () => {
		wrapper.setProps({ facetFilters: {} });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
		expect(onToggleSeeOnlySelected).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogSeeOnlyFilteredBtn').at(0).simulate('click');
		expect(onToggleSeeOnlySelected).toHaveBeenCalledTimes(0);
	});

	it("Test component filter input on change event", () => {
		wrapper.setProps({ groupKey: "tenants.tags", facets, filterText: "tag1" });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onSetFilterText).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogFilterInput').at(0).props().onChange('tag');
		jest.runAllTimers();
		expect(onSetFilterText).toHaveBeenCalledTimes(1);
		expect(onSetFilterText).toHaveBeenCalledWith('tag');
	});

	it("Test component filter input clear button click event", () => {
		wrapper.setProps({ groupKey: "tenants.tags", facets, filterText: "tag1" });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(facets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ facets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(onSetFilterText).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsShowMoreDialogFilterInputClearBtn').at(0).simulate('click');
		expect(onSetFilterText).toHaveBeenCalledTimes(1);
		expect(onSetFilterText).toHaveBeenCalledWith('');
	});

	it("Test untagged document tag special render", () => {
		const newFacetsGroups = {
			...facetsGroups,
			"tenants.tags": [{ key: Facet.untaggedDocumentKey, counter: 20 }]
		};
		const newFacets = {
			groups: newFacetsGroups
		};
		wrapper.setProps({ groupKey: "tenants.tags", facets: newFacets });
		const instance = wrapper.instance();
		const facetItems = instance._getItemsFromGroupKey(newFacets, {});
		const facetItemsHash: FacetItemHash = instance._createFacetItemHash(facetItems, {}, {});
		wrapper.setProps({ groupKey: "tenants.tags", facets: newFacets, facetItems: TreeUtils.createTree(facetItems), facetItemsHash });
		wrapper.update();
		expect(wrapper.find('.search-facets-dialog-item .custom-facet').exists()).toBe(true);
	});
});
