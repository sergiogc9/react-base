import { all } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import merge from 'lodash/merge';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/search/results';
import { operators as searchOperators } from '@src/store/search';
import { sagas as searchSagas } from '@src/store/search';
import { operators as filterOperators } from '@src/store/search/filters';
import { operators as facetOperators } from '@src/store/search/facets';
import { operators as notificationOperators } from '@src/store/app/notifications';

import { State as ResultsState } from '@src/store/search/results/reducers';
import { State } from '@src/store/types';
import { DocumentObject, ApiArticleSearchDocument, ApiPreviewSearchDocument } from '@src/class/Document';
import Api from '@src/lib/ajax/Api';

function* sagasWithFilterSagas() {
	yield all([
		searchSagas()
	]);
}

const appAndRouterState = {
	app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
	router: { location: { pathname: "/article" } }
};

const results: ResultsState = {
	documentSources: null,
	documents: null,
	pageDocuments: 0,
	total: 0,
	loadingDocumentsSources: false,
	loadingDocuments: false,
	loadingRemoveDocument: {},
	loadingSetTagsCategoryDocument: {},
	documentsChecked: {}
};

const documentObjects: DocumentObject[] = [
	{
		place: null,
		date_from_provider: "1992-03-05T06:30:57Z",
		tags: [],
		queries: [],
		category: null,
		media: { thumb: "fake" },
		image_url: "",
		image: { thumb: "fake" },
		page_number: "",
		brand_associated: "",
		category_id: "",
		country: {
			iso: "es"
		},
		issue_number: "",
		page_occupation: 0,
		author: {
			id: 1506856080,
			name: "Igor Giannasi"
		},
		content: "content",
		date: "2019-04-04T06:30:57Z",
		id: "1234",
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
			name: "fake source name"
		},
		title: "title",
		cover: "cover",
		company: "company",
		line: "line"
	}
];

const apiArticleDocuments: ApiArticleSearchDocument[] = [{ id: '1234', source: { queries: [], tags: [], categories_id: null } }];
const apiPreviewDocuments: ApiPreviewSearchDocument[] = ['1234'];
const documentWithCategory: DocumentObject = { ...documentObjects[0], category: "1234" };
const tag = "test";
const documentWithTag: DocumentObject = { ...documentObjects[0], tags: [tag] };

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Results reducer', () => {

	it('reset search leaves state as is', () => {
		expect(reducers(
			getFullState({ search: { results: { documentsChecked: { 12345: true, 1234: true } } } }),
			operators.resetSearchResultsData()
		))
			.toMatchObject({
				...INITIAL_STATE
			});
	});

	it('reducer fetch search', () => {
		expect(reducers(
			getFullState({ search: { results: { documentsChecked: { 2332: true } } } }),
			operators.fetchSearch()
		).search.results)
			.toMatchObject({
				...results,
				loadingDocuments: true,
				documentsChecked: {}
			});
	});

	it('reducer fetch search success', () => {
		expect(reducers(
			getFullState(),
			operators.fetchSearchSuccess({ documents: apiArticleDocuments, total: 1 })
		).search.results)
			.toMatchObject({
				...results,
				loadingDocuments: false,
				documents: apiArticleDocuments,
				total: 1
			});
	});

	it('reducer fetch search error', () => {
		const error = new Error();
		expect(reducers(
			getFullState(),
			operators.fetchSearchError()
		).search.results)
			.toMatchObject({
				...results,
				loadingDocuments: false,
			});
	});

	it('reducer fetch documents', () => {
		expect(reducers(
			getFullState(),
			operators.fetchDocuments()
		).search.results)
			.toMatchObject({
				...results,
				loadingDocumentsSources: true,
			});
	});

	it('reducer fetch documents success', () => {
		expect(reducers(
			getFullState(),
			operators.fetchDocumentsSuccess({ documents: documentObjects })
		).search.results)
			.toMatchObject({
				...results,
				loadingDocumentsSources: false,
				documentSources: documentObjects
			});
	});

	it('reducer fetch documents error', () => {
		const error = new Error();
		expect(reducers(
			getFullState(),
			operators.fetchDocumentsError({ error })
		).search.results)
			.toMatchObject({
				...results,
				loadingDocumentsSources: false,
			});
	});

	it('reducer remove documents', () => {
		expect(reducers(
			getFullState(),
			operators.removeDocument({ id: "1234" })
		).search.results)
			.toMatchObject({
				...results,
				loadingRemoveDocument: { 1234: true }
			});
	});

	it('reducer remove documents success', () => {
		expect(reducers(
			getFullState(),
			operators.removeDocumentSuccess({ id: "1234" })
		).search.results)
			.toMatchObject({
				...results,
				loadingRemoveDocument: {},
				documentsChecked: {}
			});
	});

	it('reducer remove documents success redundant', () => {
		expect(reducers(
			getFullState({ search: { results: { documentsChecked: { 12345: true, 1234: true } } } }),
			operators.removeDocumentSuccess({ id: "1234" })
		).search.results)
			.toMatchObject({
				...results,
				loadingRemoveDocument: {},
				documentsChecked: { 12345: true }
			});
	});

	it('reducer remove documents error', () => {
		const error = new Error();
		expect(reducers(
			getFullState(),
			operators.removeDocumentError({ error, id: "1234" })
		).search.results)
			.toMatchObject({
				...results,
				loadingRemoveDocument: {}
			});
	});

	it('reducer remove bulk documents', () => {
		expect(reducers(
			getFullState({ search: { results: { documentsChecked: { 1234: true, 342: true } } } }),
			operators.removeDocumentBulk()
		).search.results)
			.toMatchObject({
				...results,
				loadingRemoveDocument: { 1234: true, 342: true }
			});
	});

	it('reducer remove bulk documents success', () => {
		expect(reducers(
			getFullState({ search: { results: { documentsChecked: { 1234: true, 342: true } } } }),
			operators.removeDocumentBulkSuccess()
		).search.results)
			.toMatchObject({
				...results,
				loadingRemoveDocument: {},
				documentsChecked: {}
			});
	});

	it('reducer remove bulk documents error', () => {
		const error = new Error();
		expect(reducers(
			getFullState(),
			operators.removeDocumentBulkError({ error })
		).search.results)
			.toMatchObject({
				...results,
				loadingRemoveDocument: {},
				documentsChecked: {}
			});
	});

	it('reducer set documents', () => {
		expect(reducers(
			getFullState(),
			operators.setDocuments({ documentSources: documentObjects })
		).search.results)
			.toMatchObject({
				...results,
				documentSources: documentObjects
			});
	});

	it('reducer toggle document checked (add)', () => {
		expect(reducers(
			getFullState(),
			operators.toggleDocumentChecked({ id: "1234" })
		).search.results)
			.toMatchObject({
				...results,
				documentsChecked: { 1234: true }
			});
	});

	it('reducer toggle document checked (remove)', () => {
		expect(reducers(
			getFullState({ search: { results: { documentsChecked: { 1234: true } } } }),
			operators.toggleDocumentChecked({ id: "1234" })
		).search.results)
			.toMatchObject({
				...results,
				documentsChecked: {}
			});
	});

	it('reducer toggle all document checked', () => {
		expect(reducers(
			getFullState({ search: { results: { documentSources: documentObjects } } }),
			operators.toggleAllDocumentsChecked({ check: true })
		).search.results)
			.toMatchObject({
				...results,
				documentsChecked: { 1234: true },
				documentSources: documentObjects
			});
	});

	it('reducer toggle all document checked (remove)', () => {
		expect(reducers(
			getFullState(),
			operators.toggleAllDocumentsChecked({ check: false })
		).search.results)
			.toMatchObject({
				...results,
				documentsChecked: {}
			});
	});

	it('saga should fetch empty documents search', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), { documents: [], total: 0 }],
				[matchers.call.fn(Api.prototype.post), { documentObjects: [] }]
			])
			.put(operators.fetchDocumentsSuccess({ documents: [] }))
			.put(operators.fetchSearchSuccess({ documents: [], total: 0 }))
			.dispatch(operators.fetchSearch())
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						...results,
						documents: [],
						documentSources: [],
						total: 0
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should fetch empty documents search with specific range', () => {
		const date = new Date();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				search: { form: { period: "custom", begin_date: new Date(0), end_date: date }, filters: { feeds: ["id-feed"], focus: ["id-focus"] } },
				router: { location: { pathname: "/article" } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), { documents: [], total: 0 }],
				[matchers.call.fn(Api.prototype.post), { documentObjects: [] }]
			])
			.put(operators.fetchDocumentsSuccess({ documents: [] }))
			.put(operators.fetchSearchSuccess({ documents: [], total: 0 }))
			.dispatch(operators.fetchSearch())
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					form: { period: "custom", begin_date: new Date(0), end_date: date },
					results: {
						...results,
						documents: [],
						documentSources: [],
						total: 0
					},
					facets: {
						loadingFacets: true
					},
					filters: { feeds: ["id-feed"], focus: ["id-focus"] }
				}
			}))
			.silentRun();
	});

	it('saga should fetch empty documents search in preview', () => {
		const apiGetMock = ({ args }: any) => {
			const path = args[0];
			if (path.match(/feed\/preview\/search/)) return { documents: [], total: 0 };
			else if (path.match(/\/documents/)) return { documentObjects: [] };
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), dynamic(apiGetMock)]
			])
			.put(operators.fetchDocumentsSuccess({ documents: [] }))
			.put(operators.fetchSearchSuccess({ documents: [], total: 0 }))
			.dispatch(operators.fetchSearch())
			.hasFinalState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: {
					results: {
						...results,
						documents: [],
						documentSources: [],
						total: 0
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should fetch documents search without query', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), { documents: apiArticleDocuments, total: 1 }],
				[matchers.call.fn(Api.prototype.post), documentObjects]
			])
			.put(operators.fetchDocumentsSuccess({ documents: documentObjects }))
			.put(operators.fetchSearchSuccess({ documents: apiArticleDocuments, total: 1 }))
			.put(operators.setDocuments({ documentSources: [DocumentObject.create(documentObjects[0], apiArticleDocuments[0])] }))
			.dispatch(operators.fetchSearch())
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						...results,
						documents: apiArticleDocuments,
						documentSources: [DocumentObject.create(documentObjects[0], apiArticleDocuments[0])],
						total: 1
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should fetch documents search with query', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					form: {
						query: "fake"
					},
					filters: {
						facetsGroups: {
							"channel_type_id": [{ key: "online" }],
							"language_id": [{ key: "es" }],
							"tenants.categories_id": [{ key: "00" }],
							"tenants.tags": [{ key: "tag1" }],
							"country_path": [{ key: "0012" }],
							"media_id": [{ key: "11111" }]
						}
					},
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), { documents: apiArticleDocuments, total: 1 }],
				[matchers.call.fn(Api.prototype.post), documentObjects]
			])
			.put(operators.fetchDocumentsSuccess({ documents: documentObjects }))
			.put(operators.fetchSearchSuccess({ documents: apiArticleDocuments, total: 1 }))
			.put(operators.setDocuments({ documentSources: [DocumentObject.create(documentObjects[0], apiArticleDocuments[0])] }))
			.dispatch(operators.fetchSearch())
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					form: {
						query: "fake"
					},
					results: {
						...results,
						documents: apiArticleDocuments,
						documentSources: [DocumentObject.create(documentObjects[0], apiArticleDocuments[0])],
						total: 1
					},
					filters: {
						facetsGroups: {
							"channel_type_id": [{ key: "online" }],
							"language_id": [{ key: "es" }],
							"tenants.categories_id": [{ key: "00" }],
							"tenants.tags": [{ key: "tag1" }],
							"country_path": [{ key: "0012" }],
							"media_id": [{ key: "11111" }]
						}
					},
					facets: {
						loadingFacets: true
					},
				}
			}))
			.silentRun();
	});

	it('saga should fetch documents search in preview', () => {
		const apiGetMock = ({ args }: any) => {
			const path = args[0];
			if (path.match(/feed\/preview\/search/)) return { documents: apiPreviewDocuments, total: 1 };
			else if (path.match(/feed\/preview\/facets/)) return { documents: apiPreviewDocuments, total: 1 };
			else if (path.match(/\/documents/)) return documentObjects;
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: {
					filters: {
						facetsGroups: {
							"channel_type_id": [{ key: "online" }],
							"language_id": [{ key: "es" }],
							"tenants.categories_id": [{ key: "00" }],
							"tenants.tags": [{ key: "tag1" }],
							"country_path": [{ key: "0012" }],
							"media_id": [{ key: "11111" }]
						}
					},
				},
				focus: { feed: { feedType: "socialmedia", social: { definition: { include_epxressions: [] } } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), dynamic(apiGetMock)]
			])
			.put(operators.fetchDocumentsSuccess({ documents: documentObjects }))
			.put(operators.fetchSearchSuccess({ documents: apiPreviewDocuments, total: 1 }))
			.put(operators.setDocuments({ documentSources: [DocumentObject.create(documentObjects[0], "")] }))
			.dispatch(operators.fetchSearch())
			.hasFinalState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: {
					results: {
						...results,
						documents: apiPreviewDocuments,
						documentSources: [DocumentObject.create(documentObjects[0], apiPreviewDocuments[0])],
						total: 1
					},
					filters: {
						facetsGroups: {
							"channel_type_id": [{ key: "online" }],
							"language_id": [{ key: "es" }],
							"tenants.categories_id": [{ key: "00" }],
							"tenants.tags": [{ key: "tag1" }],
							"country_path": [{ key: "0012" }],
							"media_id": [{ key: "11111" }]
						}
					},
					facets: {
						loadingFacets: true
					},
				},
				focus: { feed: { feedType: "socialmedia", social: { definition: { include_epxressions: [] } } } }
			}))
			.silentRun();
	});

	it('saga should fetch documents search in preview with main query', () => {
		const apiGetMock = ({ args }: any) => {
			const path = args[0];
			if (path.match(/feed\/preview\/search/)) return { documents: apiPreviewDocuments, total: 1 };
			else if (path.match(/feed\/preview\/facets/)) return { documents: apiPreviewDocuments, total: 1 };
			else if (path.match(/\/documents/)) return documentObjects;
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: {
					filters: {
						facetsGroups: {
							"channel_type_id": [{ key: "online" }],
							"language_id": [{ key: "es" }],
							"tenants.categories_id": [{ key: "00" }],
							"tenants.tags": [{ key: "tag1" }],
							"country_path": [{ key: "0012" }],
							"media_id": [{ key: "11111" }]
						}
					},
				},
				focus: { feed: { feedType: "socialmedia", social: { definition: { main: { q: "edited-query" }, include_expressions: [{ enabled: true, q: "girona", scope: ["tags"] }] } } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), dynamic(apiGetMock)]
			])
			.put(operators.fetchDocumentsSuccess({ documents: documentObjects }))
			.put(operators.fetchSearchSuccess({ documents: apiPreviewDocuments, total: 1 }))
			.put(operators.setDocuments({ documentSources: [DocumentObject.create(documentObjects[0], "")] }))
			.dispatch(operators.fetchSearch())
			.hasFinalState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: {
					results: {
						...results,
						documents: apiPreviewDocuments,
						documentSources: [DocumentObject.create(documentObjects[0], apiPreviewDocuments[0])],
						total: 1
					},
					filters: {
						facetsGroups: {
							"channel_type_id": [{ key: "online" }],
							"language_id": [{ key: "es" }],
							"tenants.categories_id": [{ key: "00" }],
							"tenants.tags": [{ key: "tag1" }],
							"country_path": [{ key: "0012" }],
							"media_id": [{ key: "11111" }]
						}
					},
					facets: {
						loadingFacets: true
					},
				},
				focus: { feed: { feedType: "socialmedia", social: { definition: { main: { q: "edited-query" }, include_expressions: [{ enabled: true, q: "girona", scope: ["tags"] }] } } } }
			}))
			.silentRun();
	});

	it('saga should fetch documents search error', () => {
		const error = new Error('SOME_ERROR');
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)],
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.dispatch(operators.fetchSearch())
			.put(facetOperators.fetchAPIFacets())
			.put(searchOperators.setFetchSearchError({ error }))
			.put(facetOperators.fetchFacetsError())
			.put(operators.fetchSearchError())
			.hasFinalState(getFullState({
				...appAndRouterState,
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: {
					results: {
						loadingDocuments: false
					},
					facets: {
						loadingFacets: false
					}
				}
			}))
			.silentRun();
	});

	it('saga should remove document', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.put(operators.removeDocumentSuccess({ id: "1234" }))
			.dispatch(operators.removeDocument({ id: "1234" }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						loadingDocuments: true
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should remove document error', () => {
		const error = new Error('SOME_ERROR');
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), throwError(error)],
			])
			.put(operators.removeDocumentError({ error, id: "1234" }))
			.dispatch(operators.removeDocument({ id: "1234" }))
			.hasFinalState(getFullState({
				...appAndRouterState
			}))
			.silentRun();
	});

	it('saga should remove bulk document', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: { results: { documentsChecked: { 1234: true, 342: true } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 2 }],
			])
			.put(operators.removeDocumentBulkSuccess())
			.dispatch(operators.removeDocumentBulk())
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						loadingDocuments: true
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should remove bulk document error', () => {
		const error = new Error('SOME_ERROR');
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: { results: { documentsChecked: { 1234: true, 342: true } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), throwError(error)],
			])
			.put(operators.removeDocumentBulkError({ error }))
			.dispatch(operators.removeDocumentBulk())
			.hasFinalState(getFullState({
				...appAndRouterState
			}))
			.silentRun();
	});

	it('saga should set tags and category', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: { results: { documentsChecked: { 1234: true, 342: true } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), {}],
			])
			.put(operators.setTagsCategorySuccess())
			.dispatch(operators.setTagsCategory({ tags: ['tata'], category: '111' }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						loadingDocuments: true
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should set only tags', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: { results: { documentsChecked: { 1234: true, 342: true } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), {}],
			])
			.put(operators.setTagsCategorySuccess())
			.dispatch(operators.setTagsCategory({ tags: ['tata'], category: "" }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						loadingDocuments: true
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should set only category', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: { results: { documentsChecked: { 1234: true, 342: true } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), {}],
			])
			.put(operators.setTagsCategorySuccess())
			.dispatch(operators.setTagsCategory({ tags: [], category: "1234589" }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						loadingDocuments: true
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should set tags and category error', () => {
		const error = new Error('SOME_ERROR');
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: { results: { documentsChecked: { 1234: true, 342: true } } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), throwError(error)],
			])
			.put(operators.setTagsCategoryError({ error }))
			.dispatch(operators.setTagsCategory({ tags: ['tata'], category: '111' }))
			.hasFinalState(getFullState({
				...appAndRouterState
			}))
			.silentRun();
	});

	it('saga should remove document category and update facets', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": [{ key: documentWithCategory.category, counter: 20 }],
							}
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithCategory, category: null }] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": [{ key: documentWithCategory.category!, counter: 19 }],
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should remove document category and delete facet and filter', () => {
		const apiGetMock = ({ args }: any) => {
			const path = args[0];
			if (path.match(/\/documents\/search/)) return { documents: apiArticleDocuments, total: 1 };
			else if (path.match(/\/documents\/facets/)) return { facets: { "tenants.categories_id": [] } };
		};
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": [{ key: documentWithCategory.category, counter: 1 }],
							}
						}
					},
					filters: {
						facetsGroups: {
							"tenants.categories_id": [{ key: documentWithCategory.category }]
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), dynamic(apiGetMock)],
				[matchers.call.fn(Api.prototype.post), [{ ...documentWithCategory, category: '' }]],
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.put(filterOperators.setFacetGroupFilters({ groupKey: "tenants.categories_id", groupFacetsFiltered: [] }))
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						documents: apiArticleDocuments,
						documentSources: [{ ...documentWithCategory, category: null }],
						total: 1
					},
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": []
							}
						},
						loadingFacets: false
					},
					filters: {
						facetsGroups: {}
					}
				}
			}))
			.silentRun();
	});

	it('saga should throw error on remove document category', () => {
		const error = new Error('SOME_ERROR');
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.delete), throwError(error)],
			])
			.put(operators.removeDocumentCategoryError({ error }))
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga remove document category api response deleted 0 case', () => {
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 0 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga remove document category empty documents case', () => {
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: null },
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						documentSources: []
					}
				}
			}))
			.silentRun();
	});

	it('saga remove document category wrong document case', () => {
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: "9999999", category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
				}
			}))
			.silentRun();
	});

	it('saga remove document category wrong facet case', () => {
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": [{ key: "aaaa", counter: 20 }],
							}
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithCategory, category: null }] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": [{ key: "aaaa", counter: 20 }],
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should remove document category empty facets case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
					facets: {
						facets: null
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithCategory, category: null }] },
					facets: {
						facets: null
					}
				}
			}))
			.silentRun();
	});

	it('saga remove document category empty wrong filter category case', () => {
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": [{ key: documentWithCategory.id, counter: 1 }],
							}
						}
					},
					filters: {
						facetsGroups: {
							"tenants.aaaa": [{ key: documentWithCategory.category }]
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithCategory, category: null }] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": []
							}
						},
					},
					filters: {
						facetsGroups: {
							"tenants.aaaa": [{ key: documentWithCategory.category }]
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga remove document category empty wrong filter case', () => {
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithCategory] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": [{ key: documentWithCategory.id, counter: 1 }],
							}
						}
					},
					filters: {
						facetsGroups: {
							"tenants.categories_id": [{ key: "1" }]
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentCategory({ id: documentWithCategory.id, category: documentWithCategory.category! }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithCategory, category: null }] },
					facets: {
						facets: {
							groups: {
								"tenants.categories_id": []
							}
						},
					},
					filters: {
						facetsGroups: {
							"tenants.categories_id": [{ key: "1" }]
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should remove document tag and update facets', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithTag] },
					facets: {
						facets: {
							groups: {
								"tenants.tags": [{ key: tag, counter: 20 }],
							}
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentTag({ id: documentWithTag.id, tag }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithTag, tags: [] }] },
					facets: {
						facets: {
							groups: {
								"tenants.tags": [{ key: tag, counter: 19 }],
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should remove document tag, update facets and delete filters', () => {
		const documentWithoutTag = { ...documentWithTag, tags: [] };
		const apiGetMock = ({ args }: any) => {
			const path = args[0];
			if (path.match(/\/documents\/search/)) return { documents: apiArticleDocuments, total: 1 };
			else if (path.match(/\/documents\/facets/)) return { facets: { "tenants.tags": [] } };
		};
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						documentSources: [documentWithTag],
					},
					facets: {
						facets: {
							groups: {
								"tenants.tags": [{ key: tag, counter: 1 }],
							}
						}
					},
					filters: {
						facetsGroups: {
							"tenants.tags": [{ key: tag }]
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), dynamic(apiGetMock)],
				[matchers.call.fn(Api.prototype.post), [documentWithoutTag]],
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentTag({ id: documentWithTag.id, tag }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documents: apiArticleDocuments, documentSources: [documentWithoutTag], total: 1 },
					facets: {
						facets: {
							groups: {
								"tenants.tags": []
							}
						},
						loadingFacets: false
					},
					filters: {
						facetsGroups: {}
					}
				}
			}))
			.silentRun();
	});

	it('saga should throw error on remove document tag', () => {
		const error = new Error('SOME_ERROR');
		return expectSaga(sagasWithFilterSagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), throwError(error)],
			])
			.put(operators.removeDocumentTagError({ error }))
			.dispatch(operators.removeDocumentTag({ id: documentWithTag.id, tag }))
			.hasFinalState(getFullState({ ...appAndRouterState }))
			.silentRun();
	});

	it('saga remove document tag empty tags case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithTag, tags: [] }] },
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentTag({ id: documentWithTag.id, tag }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [{ ...documentWithTag, tags: [] }] },
				}
			}))
			.silentRun();
	});

	it('saga remove document tag api response deleted 0 case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 0 }],
			])
			.dispatch(operators.removeDocumentTag({ id: documentWithTag.id, tag }))
			.hasFinalState(getFullState({
				...appAndRouterState
			}))
			.silentRun();
	});

	it('saga remove document tag empty documents case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: null },
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentTag({ id: documentWithTag.id, tag }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [] },
				}
			}))
			.silentRun();
	});

	it('saga remove document tag wrong document case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithTag] }
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.delete), { deleted: 1 }],
			])
			.dispatch(operators.removeDocumentTag({ id: "99999", tag }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: { documentSources: [documentWithTag] },
				}
			}))
			.silentRun();
	});

	it('saga should filter print documents on categorization', () => {
		const documentSources = [...documentObjects, { ...documentObjects[0], id: '342', provider: "Print" }];
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						documentsChecked: { 1234: true, 342: true },
						documentSources
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), {}],
			])
			.call.fn(Api.prototype.put)
			.put(notificationOperators.add({ notification: { t: 'error.categorization_print_is_forbidden', level: 'warning' } }))
			.put(operators.setTagsCategorySuccess())
			.dispatch(operators.setTagsCategory({ tags: [], category: "1234589" }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						loadingDocuments: true,
						documentSources
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});

	it('saga should filter print documents and not make api call', () => {
		const documentSources = [{ ...documentObjects[0], id: '342', provider: "Print" }];
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						documentsChecked: { 342: true },
						documentSources
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), {}],
			])
			.not.call.fn(Api.prototype.put)
			.put(notificationOperators.add({ notification: { t: 'error.categorization_print_is_forbidden', level: 'warning' } }))
			.put(operators.setTagsCategorySuccess())
			.dispatch(operators.setTagsCategory({ tags: [], category: "1234589" }))
			.hasFinalState(getFullState({
				...appAndRouterState,
				search: {
					results: {
						loadingDocuments: true,
						documentSources
					},
					facets: {
						loadingFacets: true
					}
				}
			}))
			.silentRun();
	});
});
