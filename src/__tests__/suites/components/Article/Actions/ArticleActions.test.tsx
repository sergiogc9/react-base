import { mount, shallow } from "enzyme";
import React from "react";
import ArticleActions from "@src/components/Article/Actions/ArticleActions";
import { DocumentObject } from "@src/class/Document";
import GA from '@src/lib/googleAnalytics';

let onToggleAllDocumentsMock: any;
let onRemoveDocumentBulkMock: any;
let onSetTagsCategoryMock: any;
const documentSources: DocumentObject[] | null = [
	{
		place: null,
		date_from_provider: "",
		tags: null,
		queries: [],
		category: null,
		media: null,
		image_url: "",
		image: null,
		page_number: "",
		brand_associated: "",
		category_id: "",
		country: null,
		issue_number: "",
		page_occupation: 0,
		author: {
			id: 1506856080,
			name: "Igor Giannasi"
		},
		content: "content",
		date: "2019-04-04T06:30:57Z",
		id: "15543594571385654087",
		language: {
			code: "pt",
			id: "7",
			name: "Portuguese"
		},
		link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
		location: {
			continent: {
				id: "02",
				name: "South America"
			},
			country: {
				id: "0208",
				iso: "BR",
				name: "Brazil"
			}
		},
		provider: "News",
		rank: {
			audience: 1311327,
			similarweb_monthly_visits: 61423055,
		},
		social: {},
		source: {
			id: "1233730921",
			title: "http://www.terra.com.br",
			url: "http://www.terra.com.br",
			name: ""
		},
		title: "Peça &#39;O Aniversário de Jean Lucca&#39; retrata a &#39;cultura da indiferença&#39; na sociedade brasileira",
	}
];

describe("Search Actions", () => {
	let wrapper: any;

	beforeEach(() => {
		onToggleAllDocumentsMock = jest.fn();
		onRemoveDocumentBulkMock = jest.fn();
		onSetTagsCategoryMock = jest.fn();
		wrapper = mount(
			<ArticleActions
				documentSources={documentSources}
				documentsChecked={{ 15543594571385654087: true }}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
	});

	it("Test component snapshot without results checked", () => {
		wrapper = mount(
			<ArticleActions
				documentSources={[]}
				documentsChecked={{}}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot with results checked", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test check all documents event", () => {
		expect(onToggleAllDocumentsMock).toHaveBeenCalledTimes(0);
		wrapper.find('#documentSelectAll').at(0).props().onChange();
		expect(onToggleAllDocumentsMock).toHaveBeenCalledTimes(1);
	});

	it("Test remove action selected", () => {
		expect(wrapper.state().removeAction).toBe(false);
		wrapper.find('.document-actions-remove').at(0).simulate('click');
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.state().removeAction).toBe(true);
	});

	it("Test remove action close", () => {
		wrapper.find('.document-actions-remove').at(0).simulate('click');
		expect(wrapper.state().removeAction).toBe(true);
		wrapper.find('.confirm-cancel').at(0).simulate('click');
		expect(wrapper.state().removeAction).toBe(false);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test remove document", () => {
		wrapper.find('.document-actions-remove').at(0).simulate('click');
		expect(onRemoveDocumentBulkMock).toHaveBeenCalledTimes(0);
		wrapper.find('.confirm-accept').at(0).simulate('click');
		expect(onRemoveDocumentBulkMock).toHaveBeenCalledTimes(1);
	});

	it("Test categorize action selected", () => {
		wrapper = shallow(
			<ArticleActions
				documentSources={documentSources}
				documentsChecked={{ 15543594571385654087: true }}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
		expect(wrapper.state().categorizeAction).toBe(false);
		wrapper.find('.document-actions-categorization').at(0).simulate('click');
		expect(wrapper.debug()).toMatchSnapshot();
		expect(wrapper.state().categorizeAction).toBe(true);
	});

	it("Test onAddTagsCalled and onRemoveTag and setCategory", () => {
		const set = new Set();
		wrapper = shallow(
			<ArticleActions
				documentSources={documentSources}
				documentsChecked={{ 15543594571385654087: true }}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
		wrapper.find('.document-actions-categorization').at(0).simulate('click');
		wrapper.find("#categorizeActionContent").children().at(1).props().onAddTags(['tagTest']);
		set.add('tagTest');
		expect(wrapper.state().tags).toEqual(set);
		wrapper.find("#categorizeActionContent").children().at(1).props().onRemoveTag('tagTest');
		set.delete('tagTest');
		expect(wrapper.state().tags).toEqual(set);
		wrapper.find("#categorizeActionContent").children().at(1).props().onSetCategory('00110011');
		expect(wrapper.state().category).toEqual("00110011");
	});

	it("Test onSetTagsCategory confirm action", () => {
		wrapper = shallow(
			<ArticleActions
				documentSources={documentSources}
				documentsChecked={{ 15543594571385654087: true }}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
		expect(onSetTagsCategoryMock).toHaveBeenCalledTimes(0);
		wrapper.find('.document-actions-categorization').at(0).simulate('click');
		wrapper.find('.confirm-accept').at(0).simulate('click');
		expect(onSetTagsCategoryMock).toHaveBeenCalledTimes(1);
	});

	it("Test onSetTagsCategory dismiss action", () => {
		wrapper = shallow(
			<ArticleActions
				documentSources={documentSources}
				documentsChecked={{ 15543594571385654087: true }}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
		wrapper.find('.document-actions-categorization').at(0).simulate('click');
		expect(wrapper.state().categorizeAction).toBe(true);
		wrapper.find('.confirm-cancel').at(0).simulate('click');
		expect(wrapper.state().categorizeAction).toBe(false);
	});

	it("Test update props", () => {
		wrapper.setProps({ documentsChecked: {} });
		wrapper.update();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test remove documents tracker", () => {
		GA.trackEvent = jest.fn();
		wrapper = shallow(
			<ArticleActions
				documentSources={documentSources}
				documentsChecked={{ 15543594571385654087: true }}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('.document-actions-remove').at(0).simulate('click');
		wrapper.find('.confirm-accept').at(0).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
		expect(GA.trackEvent).toHaveBeenCalledWith({ category: 'Feed results', action: 'Remove mention' });

		wrapper.setProps({ ...wrapper.props, documentsChecked: { 15543594571385654087: true, 1554359457138565890: true } });
		wrapper.find('.confirm-accept').at(0).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(2);
		expect(GA.trackEvent).toHaveBeenCalledWith({ category: 'Feed results', action: 'Remove multiple mentions' });

	});

	it("Test onSetTagsCategory trackers", () => {
		const set = new Set();
		set.add('tagTest');
		GA.trackEvent = jest.fn();

		wrapper = shallow(
			<ArticleActions
				documentSources={documentSources}
				documentsChecked={{ 15543594571385654087: true }}
				onSetTagsCategory={onSetTagsCategoryMock}
				onToggleAllDocuments={onToggleAllDocumentsMock}
				onRemoveDocumentBulk={onRemoveDocumentBulkMock}
			/>
		);
		wrapper.find('.document-actions-categorization').at(0).simulate('click');
		wrapper.find('.confirm-accept').at(0).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);

		wrapper.setState({ ...wrapper.state, tags: set });
		wrapper.find('.confirm-accept').at(0).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);

		wrapper.setState({ ...wrapper.state, category: "123456" });
		wrapper.find('.confirm-accept').at(0).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(3);
	});
});
