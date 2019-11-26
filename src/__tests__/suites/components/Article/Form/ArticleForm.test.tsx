import { mount } from "enzyme";
import React from "react";
import { MemoryRouter } from 'react-router-dom';

import ArticleForm from "@src/components/Article/Form/ArticleForm";
import GA from '@src/lib/googleAnalytics';
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

describe("Search Form", () => {
	let wrapper: any;

	let onSetSortMock = jest.fn();
	let onSetLimitMock = jest.fn();
	let onSetQueryMock = jest.fn();
	let onSubmitMock = jest.fn();
	let onToggleDrawer = jest.fn();
	let onSetShowInsertDocument = jest.fn();

	const getArticleFormComponent = () =>
		(
			<ArticleForm
				query=""
				period="last_week"
				sort="publication_date:desc"
				limit={20}
				start={0}
				total={200}
				onSubmit={onSubmitMock}
				onToggleDrawer={onToggleDrawer}
				onSetQuery={onSetQueryMock}
				onSetLimit={onSetLimitMock}
				onSetSort={onSetSortMock}
				onSetShowInsertDocument={onSetShowInsertDocument}
				loadingDocuments={false}
				tenant={tenant}
			/>
		);

	const getComponentMountedWithMemoryRouter = () => mount(
		<MemoryRouter>
			{getArticleFormComponent()}
		</MemoryRouter>
	);

	beforeEach(() => {

		onSetSortMock = jest.fn();
		onSetLimitMock = jest.fn();
		onSetQueryMock = jest.fn();
		onSubmitMock = jest.fn();
		onToggleDrawer = jest.fn();
		onSetShowInsertDocument = jest.fn();

		wrapper = mount(getArticleFormComponent());
	});

	it("Test component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test submit", () => {
		GA.trackEvent = jest.fn();
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		expect(onSubmitMock).toHaveBeenCalledTimes(0);
		wrapper.find("button.form-search-icon").at(0).simulate('click');
		expect(onSubmitMock).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test sort by echo", () => {
		GA.trackEvent = jest.fn();
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		expect(onSetSortMock).toHaveBeenCalledTimes(0);
		wrapper.find("#sortByInputSelect").at(0).props().onChange("echo:desc");
		expect(onSetSortMock).toHaveBeenCalledTimes(1);
	});

	it("Test set query", () => {
		expect(onSetQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find("#searchFormInputText").at(0).props().onChange("query");
		expect(onSetQueryMock).toHaveBeenCalledTimes(1);
	});

	it("Test submit from query input", () => {
		expect(onSubmitMock).toHaveBeenCalledTimes(0);
		wrapper.find("input#searchFormInputText").simulate('keydown', { keyCode: 13 });
		expect(onSubmitMock).toHaveBeenCalledTimes(1);
	});

	it("Test submit from query input without submit", () => {
		expect(onSubmitMock).toHaveBeenCalledTimes(0);
		wrapper.find("input#searchFormInputText").simulate('keydown', { keyCode: 14 });
		expect(onSubmitMock).toHaveBeenCalledTimes(0);
	});

	it("Test set limit", () => {
		wrapper = getComponentMountedWithMemoryRouter();

		GA.trackEvent = jest.fn();

		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		expect(onSetLimitMock).toHaveBeenCalledTimes(0);
		wrapper.find("button#formOptions-toggle").at(0).simulate('click');
		wrapper.find("ul#formOptions-list li").at(3).find("div.md-fake-btn").simulate('click');
		expect(onSetLimitMock).toHaveBeenCalledTimes(1);

		wrapper.find("button#formOptions-toggle").at(0).simulate('click');
		wrapper.find("ul#formOptions-list li").at(4).find("div.md-fake-btn").simulate('click');
		expect(onSetLimitMock).toHaveBeenCalledTimes(2);

		wrapper.find("button#formOptions-toggle").at(0).simulate('click');
		wrapper.find("ul#formOptions-list li").at(5).find("div.md-fake-btn").simulate('click');
		expect(onSetLimitMock).toHaveBeenCalledTimes(3);

		wrapper.find("button#formOptions-toggle").at(0).simulate('click');
		wrapper.find("ul#formOptions-list li").at(6).find("div.md-fake-btn").simulate('click');
		expect(onSetLimitMock).toHaveBeenCalledTimes(4);

		expect(GA.trackEvent).toHaveBeenCalledTimes(4);
	});

	it("Test on set show insert document click", () => {
		wrapper = getComponentMountedWithMemoryRouter();

		expect(onSetShowInsertDocument).toHaveBeenCalledTimes(0);
		wrapper.find("button#formOptions-toggle").at(0).simulate('click');
		wrapper.find("ul#formOptions-list li").at(1).find("div.md-fake-btn").simulate('click');
		expect(onSetShowInsertDocument).toHaveBeenCalledTimes(1);
	});

	it("Test click drawer", () => {
		expect(onToggleDrawer).toHaveBeenCalledTimes(0);
		wrapper.find("button#searchFormToggleDrawerBtn").simulate('click');
		expect(onToggleDrawer).toHaveBeenCalledTimes(1);
	});

	it("Test select sort by from button", () => {
		expect(onSetSortMock).toHaveBeenCalledTimes(0);
		wrapper.find("button#formSortByButton-toggle").at(0).simulate('click');
		wrapper.find("ul#formSortByButton-list li").at(0).find("div.md-fake-btn").simulate('click');
		expect(onSetSortMock).toHaveBeenCalledTimes(1);

		wrapper.find("button#formSortByButton-toggle").at(0).simulate('click');
		wrapper.find("ul#formSortByButton-list li").at(1).find("div.md-fake-btn").simulate('click');
		expect(onSetSortMock).toHaveBeenCalledTimes(2);

		wrapper.find("button#formSortByButton-toggle").at(0).simulate('click');
		wrapper.find("ul#formSortByButton-list li").at(2).find("div.md-fake-btn").simulate('click');
		expect(onSetSortMock).toHaveBeenCalledTimes(3);

		wrapper.find("button#formSortByButton-toggle").at(0).simulate('click');
		wrapper.find("ul#formSortByButton-list li").at(3).find("div.md-fake-btn").simulate('click');
		expect(onSetSortMock).toHaveBeenCalledTimes(4);
	});

	it("Test manage feeds tracker", () => {
		wrapper = getComponentMountedWithMemoryRouter();

		GA.trackEvent = jest.fn();
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find("button#formOptions-toggle").at(0).simulate('click');
		wrapper.find("ul#formOptions-list li").at(0).find("a.md-fake-btn").simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test audience option sort", () => {
		expect(wrapper.find("#sortByInputSelect").at(0).props().menuItems[0].value).toEqual('reach:desc');
	});
});
