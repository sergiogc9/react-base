import { shallow } from "enzyme";
import React from "react";
import { RouterState } from 'react-router-redux';
import queryString from 'query-string';

import Article from "@src/components/Article/Article";

const location: RouterState["location"] = {
	pathname: "/article",
	search: "?period=last_week",
	state: {},
	hash: ""
};

let onSetFormAndFilters: any;

describe("<Article />", () => {
	let wrapper: any;

	beforeEach(() => {

		onSetFormAndFilters = jest.fn();

		wrapper = shallow(<Article
			location={location}
			onSetFormAndFilters={onSetFormAndFilters}
		/>);
	});

	it("Test component snapshot", () => {
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Test on set form and filters execution", () => {
		expect(onSetFormAndFilters).toHaveBeenCalledTimes(1);
		expect(onSetFormAndFilters).toHaveBeenCalledWith(queryString.parse(location.search));
	});

});
