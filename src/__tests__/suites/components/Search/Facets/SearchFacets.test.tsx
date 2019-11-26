import React from "react";
import { shallow } from "enzyme";
import { RouterState } from 'connected-react-router';

import SearchFacets from "@src/components/Search/Facets/SearchFacets";
import { FacetItemsGroup, FacetObject, Facet } from "@src/class/Facet";

const facetsGroups: FacetItemsGroup = {
	'channel_type_id': [{ key: "24", counter: 22 }],
	'country_path': [{ key: "0534", counter: 100 }, { key: "0103", counter: 50 }],
	'language_id': [{ key: "127", counter: 250 }],
	'language.id': [{ key: "127", counter: 250 }] // TODO (GIS-2327): Remove it once we have all with the same field
};

const facets: FacetObject = {
	groups: facetsGroups
};

const routerLocation: RouterState["location"] = {
	pathname: "/article",
	search: "",
	state: "",
	hash: ""
};

let onFetchFocusList: any;

describe("<SearchFacets />", () => {
	let wrapper: any;

	beforeEach(() => {
		onFetchFocusList = jest.fn();
		wrapper = shallow(<SearchFacets
			location={routerLocation}
			facets={facets}
			focusList={[]}
			loadingFacets={false}
			onFetchFocusList={onFetchFocusList}
			showMoreFacetGroupKey={null}
		/>);
	});

	it("Test component snapshot", () => {
		expect(wrapper.debug()).toMatchSnapshot();
		expect(onFetchFocusList).not.toHaveBeenCalled();
	});

	it("Test component snapshot without focus list with article behaviour", () => {
		wrapper = shallow(<SearchFacets
			location={routerLocation}
			facets={facets}
			focusList={null}
			loadingFacets={false}
			onFetchFocusList={onFetchFocusList}
			showMoreFacetGroupKey={null}
		/>);
		expect(wrapper.debug()).toMatchSnapshot();
		expect(onFetchFocusList).toHaveBeenCalled();
	});

	it("Test component snapshot without focus list with definition behaviour", () => {
		wrapper = shallow(<SearchFacets
			location={{ ...routerLocation, pathname: "/focus/id/feed/id" }}
			facets={facets}
			focusList={null}
			loadingFacets={false}
			onFetchFocusList={onFetchFocusList}
			showMoreFacetGroupKey={null}
		/>);
		expect(wrapper.debug()).toMatchSnapshot();
		expect(onFetchFocusList).not.toHaveBeenCalled();
	});

	it("Test component snapshot with show more facet group key", () => {
		wrapper.setProps({ showMoreFacetGroupKey: Facet.channelGroupKey });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Loading component should not be displayed if previous facets are loaded", () => {
		wrapper.setProps({ loadingFacets: true, facets: null });
		expect(wrapper.find("CircularProgress").exists()).toEqual(true);
		wrapper.setProps({ loadingFacets: true, facets });
		expect(wrapper.find("CircularProgress").exists()).toEqual(false);
	});

	it("Test with empty facets", () => {
		wrapper.setProps({ focusList: [], facets: null});
		expect(wrapper.debug()).toMatchSnapshot();
	});
});
