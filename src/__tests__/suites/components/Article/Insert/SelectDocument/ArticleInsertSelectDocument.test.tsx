import React from "react";
import { shallow } from "enzyme";
import clone from "lodash/clone";

import ArticleInsertSelectDocument from "@src/components/Article/Insert/SelectDocument/ArticleInsertSelectDocument";
import { DocumentObject } from "@src/class/Document";
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const baseDocument = TestHelper.getDocument();

describe('<ArticleInsertSelectDocument>', () => {
	let wrapper: any;
	const onSelectedDocumentId = jest.fn();

	const getComponent = () => <ArticleInsertSelectDocument
		selectedDocumentIds={{}}
		tenantDocuments={[]}
		historicalDocuments={[]}
		feedDocuments={[]}
		onSelectedDocumentId={onSelectedDocumentId}
		loading={false}
		searchNotFoundReason={null}
	/>;

	const generateAnotherDocument = (id: string): DocumentObject => {
		const anotherDocument = clone(baseDocument);
		anotherDocument.id = id;
		return anotherDocument;
	};

	beforeEach(() => {
		wrapper = shallow(getComponent());
	});

	it("Component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with search not found reason", () => {
		wrapper.setProps({ searchNotFoundReason: "unavailable" });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("No historical documents 1 doc in feed", () => {
		wrapper.setProps({ feedDocuments: [baseDocument] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(0);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(1);
	});

	it("No feed documents 1 historical doc", () => {
		wrapper.setProps({ historicalDocuments: [baseDocument] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(1);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(0);
	});

	it("No feed documents 1 on tenant ", () => {
		wrapper.setProps({ tenantDocuments: [baseDocument] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(1);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(0);
	});

	it("Same document on historical and feed", () => {
		wrapper.setProps({ historicalDocuments: [baseDocument], feedDocuments: [baseDocument] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(0);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(1);
	});

	it("Same document on tenant and feed", () => {
		wrapper.setProps({ tenantDocuments: [baseDocument], feedDocuments: [baseDocument] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(0);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(1);
	});

	it("2 docs on historical 1 shared with feed & tenant", () => {
		const anotherBaseDocument = generateAnotherDocument("1234");
		wrapper.setProps({ historicalDocuments: [baseDocument, anotherBaseDocument], tenantDocuments: [baseDocument], feedDocuments: [baseDocument] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(1);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(1);
	});

	it("historical docs has checkbox , tenant docs doesn't", () => {
		const anotherBaseDocument = generateAnotherDocument("1234");
		wrapper.setProps({ historicalDocuments: [anotherBaseDocument], feedDocuments: [baseDocument] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(1);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(1);
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments .document-results-item-select')).toHaveLength(1);
		expect(wrapper.find('#articleInsertSelectFeedDocuments .document-results-item-select')).toHaveLength(0);
	});

	it("historical docs has checkbox are by default unchecked", () => {
		wrapper.setProps({ historicalDocuments: [baseDocument], feedDocuments: [] });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(1);
		expect(wrapper.find(`Checkbox#documentSelect-${baseDocument.id}`).props().checked).toEqual(false);
	});

	it("historical docs has checkbox checked if are selected", () => {
		wrapper.setProps({ historicalDocuments: [baseDocument], feedDocuments: [], selectedDocumentIds: { [baseDocument.id]: true } });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(1);
		expect(wrapper.find(`Checkbox#documentSelect-${baseDocument.id}`).prop('checked')).toEqual(true);
	});

	it("on select historical document checked attribute change", () => {
		wrapper.setProps({ historicalDocuments: [baseDocument], feedDocuments: [] });
		expect(onSelectedDocumentId).toHaveBeenCalledTimes(0);
		const component = wrapper.find(`Checkbox#documentSelect-${baseDocument.id}`);
		component.props().onChange();
		expect(onSelectedDocumentId).toHaveBeenCalledTimes(1);
	});

	it("Loader is not present by default", () => {
		wrapper.setProps({ feedDocuments: [baseDocument], loading: false });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#insertDocumentDialogLoading')).toHaveLength(0);
	});

	it("If loading, loader is present documets doesn't", () => {
		wrapper.setProps({ feedDocuments: [baseDocument], loading: true });
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#insertDocumentDialogLoading')).toHaveLength(1);
		expect(wrapper.find('#articleInsertSelectFeedDocuments')).toHaveLength(0);
		expect(wrapper.find('#articleInsertSelectHistoricalDocuments')).toHaveLength(0);
	});

});
