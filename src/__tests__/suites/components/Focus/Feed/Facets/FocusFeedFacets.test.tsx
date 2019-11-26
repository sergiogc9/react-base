import { shallow } from "enzyme";
import React from "react";
import FocusFeedFacets from "@src/components/Focus/Feed/Facets/FocusFeedFacets";

let onToggleDrawer: any;
describe("<FocusFeedFacets />", () => {
	let wrapper: any;

	beforeAll(() => {
		window.matchMedia = jest.fn((query: string) => ({
			matches: query.indexOf('(min-width: 1025px)') !== -1,
		}));
	});

	beforeEach(() => {
		onToggleDrawer = jest.fn();
		wrapper = shallow(<FocusFeedFacets
			drawerVisible={true}
			onToggleDrawer={onToggleDrawer}
		/>);
	});

	it("Test component snapshot", () => {
		expect(wrapper.debug()).toMatchSnapshot();
		expect(onToggleDrawer).toHaveBeenCalled();
	});

	it("Test component snapshot", () => {
		wrapper.setProps({ drawerVisible: false });
		expect(wrapper.debug()).toMatchSnapshot();
		expect(onToggleDrawer).toHaveBeenCalled();
	});
});
