import { shallow } from "enzyme";
import moment from 'moment';
import React from "react";

import ArticleFacets from "@src/components/Article/Facets/ArticleFacets";
import GA from '@src/lib/googleAnalytics';
import FormButtonGroupField from '@src/components/common/Form/ButtonGroupField/FormButtonGroupField';

let onToggleDrawer: any;
let onSetPeriod: any;
let onSetDateType: any;

const beginDate = moment().startOf('day').subtract(1, 'week').toDate();
const endDate = moment().endOf('day').toDate();

describe("<ArticleFacets />", () => {
	let wrapper: any;

	beforeAll(() => {
		window.matchMedia = jest.fn((query: string) => ({
			matches: query.indexOf('(min-width: 1025px)') !== -1
		}));
	});

	beforeEach(() => {
		onToggleDrawer = jest.fn();
		onSetPeriod = jest.fn();
		onSetDateType = jest.fn();
		wrapper = shallow(<ArticleFacets
			drawerVisible={true}
			searchPeriod="last_month"
			dateType='publication_date'
			onToggleDrawer={onToggleDrawer}
			onSetPeriod={onSetPeriod}
			onSetDateType={onSetDateType}
		/>);
	});

	it("Test component snapshot", () => {
		expect(wrapper.debug()).toMatchSnapshot();
		expect(onToggleDrawer).toHaveBeenCalled();
	});

	it("Test with custom date ranges", () => {
		wrapper.setProps({ searchPeriod: "custom", beginDate, endDate });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Test period select change", () => {
		const trackEvent = jest.fn();
		GA.trackEvent = trackEvent;
		expect(trackEvent).toHaveBeenCalledTimes(0);
		expect(onSetPeriod).toHaveBeenCalledTimes(0);
		wrapper.find('#searchFacetsPeriodSelect').at(0).props().onChange("last_week");
		expect(trackEvent).toHaveBeenCalledTimes(1);
		expect(onSetPeriod).toHaveBeenCalledTimes(1);
		wrapper.find('#searchFacetsPeriodSelect').at(0).props().onChange("custom");
		expect(trackEvent).toHaveBeenCalledTimes(2);
		expect(onSetPeriod).toHaveBeenCalledTimes(2);
	});

	it("Component onChange handler", () => {
		wrapper.find(FormButtonGroupField).at(0).props().onChangeOption('test', 'integration_date', true);
		expect(onSetDateType).toHaveBeenCalledTimes(1);
	});
});
