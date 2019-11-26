import React from "react";
import { mount, shallow } from "enzyme";
import { RouterState } from "connected-react-router";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import merge from "lodash/merge";
import CircularProgress from "react-md/lib/Progress/CircularProgress";

import SearchResultsComponent from "@src/components/Search/Results/SearchResults";
import { INITIAL_STATE } from "@src/store";
import SearchResults from "@src/components/Search/Results";
import DocumentPlaceHolder from "@src/components/common/Document/PlaceHolder/DocumentPlaceHolder";
import DocumentItem from "@src/components/common/Document/Item/DocumentItem";
import { ApiSearchDocument, DocumentObject, ApiArticleSearchDocument, ApiPreviewSearchDocument } from "@src/class/Document";
import { UserObject } from "@src/class/User";

// TODO: Use user from test helper
const user: UserObject = ({
	id: "123456",
	name: "user",
	email: "user@user.com",
	role: "admin",
	permissions: ["document.categorize", "document.tag", "document.delete"]
});

// TODO: Use document from test helper
const baseDocument: DocumentObject = {
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
		similarweb_monthly_visits: 61423055
	},
	social: {},
	source: {
		id: "1233730921",
		title: "http://www.terra.com.br",
		url: "http://www.terra.com.br",
		name: ""
	},
	title: "Peça &#39;O Aniversário de Jean Lucca&#39; retrata a &#39;cultura da indiferença&#39; na sociedade brasileira"
};

const routerLocation: RouterState["location"] = {
	pathname: "/article",
	search: "",
	state: "",
	hash: ""
};

const mockStore = configureMockStore();

function getWrappedComponent(component: JSX.Element, stateSlice: object) {
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	return mount(<Provider store={store}>{component}</Provider>);
}

describe("Search Results", () => {

	it("Test component loading documents", () => {
		const wrapper = getWrappedComponent(<SearchResults />, {
			router: { location: { pathname: "/article" } },
			search: {
				results: {
					loadingDocuments: true
				}
			}
		});
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find(CircularProgress)).toHaveLength(1);
	});

	it("Test component loading article documents", () => {
		const documents: ApiArticleSearchDocument[] = [
			{ id: "123456789", source: { queries: [], categories_id: "", tags: [] } }
		];
		const wrapper = getWrappedComponent(<SearchResults />, {
			router: { location: { pathname: "/article" } },
			search: {
				results: {
					loadingDocuments: false,
					loadingDocumentsSources: true,
					documents
				}
			}
		});
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find(CircularProgress)).toHaveLength(0);
		expect(wrapper.find(DocumentPlaceHolder)).toHaveLength(1);
	});

	it("Test component loading preview documents", () => {
		const documents: ApiPreviewSearchDocument[] = ["123456789"];
		const wrapper = getWrappedComponent(<SearchResults />, {
			router: { location: { pathname: "/focusId/feed/create/socialmedia" } },
			search: {
				results: {
					loadingDocuments: false,
					loadingDocumentsSources: true,
					documents
				}
			}
		});
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find(CircularProgress)).toHaveLength(0);
		expect(wrapper.find(DocumentPlaceHolder)).toHaveLength(1);
	});

	it("Test component loading documents without documents", () => {
		const documents: ApiSearchDocument[] | null = null;
		const wrapper = getWrappedComponent(<SearchResults />, {
			router: { location: { pathname: "/article" } },
			search: {
				results: {
					loadingDocuments: false,
					loadingDocumentsSources: true,
					documents
				}
			}
		});
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find(CircularProgress)).toHaveLength(0);
		expect(wrapper.find(DocumentPlaceHolder)).toHaveLength(0);
	});

	it("Test component loading documents without documents sources", () => {
		const documentSources: DocumentObject[] | null = null;
		const wrapper = getWrappedComponent(<SearchResults />, {
			router: { location: { pathname: "/article" } },
			app: {
				profile: {
					user
				}
			},
			search: {
				results: {
					loadingDocuments: false,
					loadingDocumentsSources: false,
					documents: null,
					documentSources
				}
			}
		});
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find(CircularProgress)).toHaveLength(0);
		expect(wrapper.find(DocumentPlaceHolder)).toHaveLength(0);
		expect(wrapper.find(DocumentItem)).toHaveLength(0);
		expect(wrapper.find('#documentResultsNoResults')).toHaveLength(1);
	});

	it("Test component loading documents with document source", () => {
		const documentSources: DocumentObject[] | null = [baseDocument];
		const wrapper = getWrappedComponent(<SearchResults />, {
			router: { location: { pathname: "/article" } },
			app: {
				profile: {
					user
				}
			},
			search: {
				results: {
					loadingDocuments: false,
					loadingDocumentsSources: false,
					documents: null,
					documentSources
				}
			}
		});
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find(CircularProgress)).toHaveLength(0);
		expect(wrapper.find(DocumentPlaceHolder)).toHaveLength(0);
		expect(wrapper.find(DocumentItem)).toHaveLength(1);
	});

	it("Test component loading documents with document source", () => {
		const documentSources: any[] | null = [{ ...baseDocument, provider: "FAKE" }];
		const wrapper = getWrappedComponent(<SearchResults />, {
			router: { location: { pathname: "/article" } },
			search: {
				results: {
					loadingDocuments: false,
					loadingDocumentsSources: false,
					documents: null,
					documentSources
				}
			}
		});
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find(CircularProgress)).toHaveLength(0);
		expect(wrapper.find(DocumentPlaceHolder)).toHaveLength(0);
		expect(wrapper.find(DocumentItem)).toHaveLength(0);
	});

	it("Test component remove document action", () => {
		const documentSources: DocumentObject[] | null = [baseDocument];

		const onRemoveDocumentMock = jest.fn();
		const onChangeDocumentCheckMock = jest.fn();
		const component = mount(
			<SearchResultsComponent
				location={routerLocation}
				loadingDocumentsSources={false}
				documents={null}
				documentSources={documentSources}
				loadingDocuments={false}
				onRemoveDocument={onRemoveDocumentMock}
				loadingRemoveDocument={{}}
				pageDocuments={0}
				total={20}
				documentsChecked={{}}
				loadingSetTagsCategoryDocument={{}}
				onChangeDocumentCheck={onChangeDocumentCheckMock}
				user={user}
			/>);
		expect(onRemoveDocumentMock).toHaveBeenCalledTimes(0);
		component.find('.icon-cancel').at(0).simulate('click');
		expect(onRemoveDocumentMock).toHaveBeenCalledTimes(1);
	});

	it("Test component remove document action without id", () => {
		const documentSources: DocumentObject[] | null = [{ ...baseDocument, id: "" }];

		const onRemoveDocumentMock = jest.fn();
		const onChangeDocumentCheckMock = jest.fn();
		const component = mount(
			<SearchResultsComponent
				location={routerLocation}
				loadingDocumentsSources={false}
				documents={null}
				documentSources={documentSources}
				loadingDocuments={false}
				onRemoveDocument={onRemoveDocumentMock}
				loadingRemoveDocument={{}}
				pageDocuments={0}
				total={20}
				documentsChecked={{}}
				loadingSetTagsCategoryDocument={{}}
				onChangeDocumentCheck={onChangeDocumentCheckMock}
				user={user}
			/>);
		expect(onRemoveDocumentMock).toHaveBeenCalledTimes(0);
		component.find('.icon-cancel').at(0).simulate('click');
		expect(onRemoveDocumentMock).toHaveBeenCalledTimes(1);
	});

	it("Test component loading remove document", () => {
		const documentSources: DocumentObject[] | null = [{ ...baseDocument, id: "1234" }];

		const onRemoveDocumentMock = jest.fn();
		const onChangeDocumentCheckMock = jest.fn();
		const component = mount(
			<SearchResultsComponent
				location={routerLocation}
				loadingDocumentsSources={false}
				documents={null}
				documentSources={documentSources}
				loadingDocuments={false}
				onRemoveDocument={onRemoveDocumentMock}
				loadingRemoveDocument={{ 1234: true }}
				pageDocuments={0}
				total={20}
				documentsChecked={{}}
				loadingSetTagsCategoryDocument={{}}
				onChangeDocumentCheck={onChangeDocumentCheckMock}
				user={user}
			/>);
		expect(component.html()).toMatchSnapshot();
	});

	it("Test component select", () => {
		const documentSources: DocumentObject[] | null = [{ ...baseDocument, id: "1234" }];

		const onRemoveDocumentMock = jest.fn();
		const onChangeDocumentCheckMock = jest.fn();
		const component = mount(
			<SearchResultsComponent
				location={routerLocation}
				loadingDocumentsSources={false}
				documents={null}
				documentSources={documentSources}
				loadingDocuments={false}
				onRemoveDocument={onRemoveDocumentMock}
				loadingRemoveDocument={{}}
				pageDocuments={0}
				total={20}
				documentsChecked={{}}
				loadingSetTagsCategoryDocument={{}}
				onChangeDocumentCheck={onChangeDocumentCheckMock}
				user={user}
			/>);
		expect(onChangeDocumentCheckMock).toHaveBeenCalledTimes(0);
		const checkbox: any = component.find('Checkbox.document-results-item-select-checkbox').at(0);
		checkbox.props().onChange();
		expect(onChangeDocumentCheckMock).toHaveBeenCalledTimes(1);
	});

	it("Test categorization visibility", () => {
		const onRemoveDocumentMock = jest.fn();
		const onChangeDocumentCheckMock = jest.fn();
		const component = shallow(
			<SearchResultsComponent
				location={routerLocation}
				loadingDocumentsSources={false}
				documents={null}
				documentSources={[baseDocument]}
				loadingDocuments={false}
				onRemoveDocument={onRemoveDocumentMock}
				loadingRemoveDocument={{}}
				pageDocuments={0}
				total={20}
				documentsChecked={{}}
				loadingSetTagsCategoryDocument={{}}
				onChangeDocumentCheck={onChangeDocumentCheckMock}
				user={user}
			/>);
		expect(component.debug()).toMatchSnapshot();

		component.setProps({ ...component.props, documentSources: [{ ...baseDocument, category: "123456" }] });
		expect(component.debug()).toMatchSnapshot();

		component.setProps({ ...component.props, documentSources: [{ ...baseDocument, company: "Company" }] });
		expect(component.debug()).toMatchSnapshot();

		component.setProps({ ...component.props, documentSources: [{ ...baseDocument, tags: ["test"] }] });
		expect(component.debug()).toMatchSnapshot();
	});

	it("Test document checkbox visibility permissions", () => {
		const onRemoveDocumentMock = jest.fn();
		const onChangeDocumentCheckMock = jest.fn();
		const documentSources: DocumentObject[] = [baseDocument];
		const component = shallow(
			<SearchResultsComponent
				location={routerLocation}
				loadingDocumentsSources={false}
				documents={null}
				documentSources={documentSources}
				loadingDocuments={false}
				onRemoveDocument={onRemoveDocumentMock}
				loadingRemoveDocument={{}}
				pageDocuments={0}
				total={20}
				documentsChecked={{}}
				loadingSetTagsCategoryDocument={{}}
				onChangeDocumentCheck={onChangeDocumentCheckMock}
				user={user}
			/>);
		expect(component.find(`#documentSelect-${baseDocument.id}`).exists()).toBe(true);

		component.setProps({ ...component.props, user: { ...user, permissions: [] } });
		expect(component.find(`#documentSelect-${baseDocument.id}`).exists()).toBe(false);
	});

	it("Test remove button permissions", () => {
		const onRemoveDocumentMock = jest.fn();
		const onChangeDocumentCheckMock = jest.fn();
		const documentSources: DocumentObject[] = [baseDocument];
		const component = shallow(
			<SearchResultsComponent
				location={routerLocation}
				loadingDocumentsSources={false}
				documents={null}
				documentSources={documentSources}
				loadingDocuments={false}
				onRemoveDocument={onRemoveDocumentMock}
				loadingRemoveDocument={{}}
				pageDocuments={0}
				total={20}
				documentsChecked={{}}
				loadingSetTagsCategoryDocument={{}}
				onChangeDocumentCheck={onChangeDocumentCheckMock}
				user={user}
			/>);
		expect(component.find('.remove-document-button').exists()).toBe(true);

		component.setProps({ ...component.props, user: { ...user, permissions: [] } });
		expect(component.find('.remove-document-button').exists()).toBe(false);
	});
});
