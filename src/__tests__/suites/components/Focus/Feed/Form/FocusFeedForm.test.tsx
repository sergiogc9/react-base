import React from "react";
import { shallow } from "enzyme";

import FocusFeedForm from "@src/components/Focus/Feed/Form/FocusFeedForm";
import { TenantObject, Settings } from "@src/class/Tenant";

const tenantSettings: Settings = {
	categorization_mode: 'flc',
	currency: 'EUR',
	display_influencers: false,
	document_tenant_indices_search: true,
	facebook_url: 'fake url',
	valuation_metric: 'miv'
};

const tenant: TenantObject = {
	id: 'rd-girona-test',
	guid: '00034972-0000-0000-0000-000000000000',
	name: 'rd.girona.test',
	tier_properties: {
		name: 'diamond',
		limit: 50000,
		results: {
			online: true,
			social: true
		}
	},
	print_only: false,
	facebook_linked_ids: [
		'10156337492683158',
		'10160315799795215',
		'206028773584551',
		'611466659195813'
	],
	settings: tenantSettings
};

describe("FocusFeedForm", () => {
	let wrapper: any;
	let onSetSort = jest.fn();
	let onSetPeriod = jest.fn();
	let onRecoverFeed = jest.fn();

	const getComponent = () => <FocusFeedForm
		sort="publication_date:desc"
		feedType="socialmedia"
		searchPeriod="last_month"
		start={0}
		limit={20}
		total={0}
		loadingDocuments={false}
		onSetSort={onSetSort}
		onSetPeriod={onSetPeriod}
		onRecoverFeed={onRecoverFeed}
		recoveryId={null}
		recoveryProgress={0}
		tenant={tenant}
	/>;

	beforeEach(() => {
		onSetSort = jest.fn();
		onSetPeriod = jest.fn();
		onRecoverFeed = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot without feed type", () => {
		wrapper.setProps({ feedType: null });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with print feed", () => {
		wrapper.setProps({ feedType: "print_percolator" });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with recovery id", () => {
		wrapper.setProps({ recoveryId: "234", recoveryProgress: 75 });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component recover feed button handler", () => {
		wrapper = shallow(getComponent());
		wrapper.find('#focusFeedFormRecoverBtn').at(0).simulate('click');
		expect(onRecoverFeed).toHaveBeenCalledTimes(1);
	});

	it("Component sort select handler", () => {
		wrapper = shallow(getComponent());
		wrapper.find('#focusFeedSortBySelectField').at(0).props().onChange('sort-value');
		expect(onSetSort).toHaveBeenCalledTimes(1);
		expect(onSetSort).toHaveBeenCalledWith("sort-value");
	});

	it("Component snapshot with custom period", () => {
		wrapper.setProps({ searchPeriod: "custom", beginDate: new Date(0), endDate: new Date() });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with date range animation in action", () => {
		wrapper.setState({ dateRangeAnimating: true });
		wrapper.setProps({ searchPeriod: "last_month", beginDate: new Date(0), endDate: new Date() });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component transition exited", () => {
		wrapper = shallow(getComponent());
		wrapper.setState({ dateRangeAnimating: true });
		wrapper.find('#focusFeedDateSelectorsTransition').at(0).props().onExited();
		expect(wrapper.state().dateRangeAnimating).toBe(false);
	});

	it("Component set period change event", () => {
		wrapper = shallow(getComponent());
		wrapper.find('#focusFeedFormPeriodSelect').at(0).props().onChange('last_3_months');
		expect(onSetPeriod).toHaveBeenCalledTimes(1);
		expect(onSetPeriod).toHaveBeenCalledWith('last_3_months');
	});

	it("Component set period change event from custom to not custom period", () => {
		wrapper = shallow(getComponent());
		wrapper.setProps({ searchPeriod: "custom", beginDate: new Date(0), endDate: new Date() });
		wrapper.find('#focusFeedFormPeriodSelect').at(0).props().onChange('last_months');
		expect(wrapper.state().dateRangeAnimating).toBe(true);
	});

	it("Component snapshot with total value", () => {
		wrapper.setProps({ total: 2000 });
		expect(wrapper.html()).toMatchSnapshot();
	});
	it("Component snapshot with total value bigger than 5000", () => {
		wrapper.setProps({ total: 10000 });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with total value smaller than limit", () => {
		wrapper.setProps({ total: 5 });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test audience option sort", () => {
		expect(wrapper.find("#focusFeedSortBySelectField").at(0).props().menuItems[0].value).toEqual('reach:desc');
	});
});
