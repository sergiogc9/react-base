import { expectSaga } from 'redux-saga-test-plan';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/article/insert';
import { operators as notificationsOperators } from '@src/store/app/notifications';
import { operators as insertOperators } from '@src/store/article/insert';
import { operators as searchOperators } from '@src/store/search/results/actions';
import { InsertDocumentStep } from '@src/types/article/insert';
import { FocusFeedsGroupKey } from '@src/types/search/form';
import { State } from '@src/store/types';
import { INITIAL_STATE as INSERT_INITIAL_STATE } from '@src/store/article/insert';
import { FeedObject } from '@src/class/Feed';
import { DocumentObject } from '@src/class/Document';
import { FocusFeeds, FocusObject } from '@src/class/Focus';
import Api from '@src/lib/ajax/Api';
import { DocParams } from '@src/store/search/results';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

const document = TestHelper.getDocument();

const feedOnline: FeedObject = {
	definition: {},
	deleted_at: new Date(1549287550563),
	enabled: true,
	filters: {},
	focus_id: "focus-id-1",
	id: "feed-id-1",
	inserted_at: new Date(1549287550563),
	name: "feed-name-1",
	oldest_document: document,
	type: "online",
	updated_at: new Date(1549287550563)
};

const feedSocial: FeedObject = {
	...feedOnline,
	id: "feed-id-2",
	name: "feed-name-2",
	type: "socialmedia"
};

const feedPrintOld: FeedObject = {
	...feedOnline,
	id: "feed-id-3",
	name: "feed-name-3",
	type: "print"
};

const feedPrintNew: FeedObject = {
	...feedOnline,
	id: "feed-id-4",
	name: "feed-name-4",
	type: "print_percolator"
};

const focusFeeds: FocusFeeds = {
	online: [feedOnline],
	socialmedia: [feedSocial],
	print: [feedPrintOld, feedPrintNew]
};

const focus: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: focusFeeds,
	id: "focus-id-1",
	inserted_at: new Date(1549287550563),
	name: "focus-name-1",
	oldest_document: document,
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url.com",
	acl_users: []
};

const focus2: FocusObject = {
	...focus,
	feeds: { online: [], socialmedia: [], print: [] },
	id: "focus-id-2",
	name: "focus-name-2",
	acl_users: []
};

const focusList: FocusObject[] = [focus, focus2];

const selectedFeedInsertStore = {
	url: "http://gironafc.cat",
	selectedFeed: { id: "feed-id-1", type: "online" }
};

const insertDocumentStore = {
	url: "http://gironafc.cat",
	selectedFeed: { id: "feed-id-1", type: "online" },
	selectedDocumentIds: { "doc-id-1": true }
};

const selectedSocialFeedInsertStore = {
	url: "https://www.instagram.com/p/B4H3CguiBtY/",
	selectedFeed: { id: "feed-id-1", type: "socialmedia" }
};

const createOnlineDocumentStore = {
	validUrl: "http://gironafc.cat",
	selectedFeed: { id: "feed-id-1", type: "online" },
	selectedDocumentIds: { "doc-id-1": true }
};

const createPrintDocumentStore = {
	selectedFeed: { id: "feed-id-1", type: "print_percolator" },
	selectedDocumentIds: { "doc-id-1": true }
};

const serverValidatedUrl = "https://gironafc.cat/";

const onlineForm = {
	title: 'test',
	content: 'test',
	country: 'ES',
	date: '2019-08-12',
	language: 'es',
	media_id: '1234',
	media_url: 'url',
	media_name: 'name',
	miv: 1,
	similarweb_monthly_visits: 2000,
	tags: new Set<string>(),
	category: '00110011'
};

const image = new File([""], "test", { type: 'image/jpg' });

const printForm = {
	title: 'test',
	country: 'ES',
	date: '2019-08-12',
	media_name: 'name',
	miv: 1,
	image,
	tags: new Set<string>(),
	category: '00110011'
};

const __getFakeDoc = (docParams: DocParams[]): DocumentObject[] => {

	return docParams.map(docParam => {
		return { ...document, id: docParam.id };
	});
};

describe('Search insert store', () => {
	it('reducer set show dialog to true', () => {
		expect(reducers(
			getFullState({ article: { insert: { step: "FILL_FORM" } } }),
			operators.setShowDialog({ show: true })
		).article.insert)
			.toMatchObject({
				...INSERT_INITIAL_STATE,
				showDialog: true
			});
	});

	it('reducer set show dialog to false', () => {
		expect(reducers(
			getFullState({ article: { insert: { step: "FILL_FORM" } } }),
			operators.setShowDialog({ show: false })
		).article.insert)
			.toMatchObject({
				...INSERT_INITIAL_STATE,
				showDialog: false
			});
	});

	it('reducer set step', () => {
		expect(reducers(
			getFullState(),
			operators.setStep({ step: "SELECT_FOUND_DOCUMENTS" })
		).article.insert)
			.toMatchObject({
				step: "SELECT_FOUND_DOCUMENTS"
			});
	});

	it('reducer set selected feed', () => {
		expect(reducers(
			getFullState(),
			operators.setSelectedFeed({ id: "fake-id", type: "socialmedia" })
		).article.insert)
			.toMatchObject({
				selectedFeed: { id: "fake-id", type: "socialmedia" }
			});
	});

	it('reducer set url', () => {
		expect(reducers(
			getFullState(),
			operators.setUrl({ url: "fakeuser@fakewebsite.com" })
		).article.insert)
			.toMatchObject({
				url: "fakeuser@fakewebsite.com"
			});
	});

	it('reducer set url with error', () => {
		expect(reducers(
			getFullState(),
			operators.setUrlError({ invalidError: "bad_error" })
		).article.insert)
			.toMatchObject({
				invalidUrlError: "bad_error"
			});
	});

	it('reducer set valid url', () => {
		expect(reducers(
			getFullState(),
			operators.setValidUrl({ url: "nicevalidated@perfectsite.com" })
		).article.insert)
			.toMatchObject({
				validUrl: "nicevalidated@perfectsite.com"
			});
	});

	it('reducer set loading', () => {
		expect(reducers(
			getFullState(),
			operators.setLoading({ loading: true })
		).article.insert)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer change step error', () => {
		expect(reducers(
			getFullState({ article: { insert: { loading: true } } }),
			operators.changeStepError({ error: {} })
		).article.insert)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer set document not found', () => {
		expect(reducers(
			getFullState({ article: { insert: {} } }),
			operators.setDocumentNotFoundReason({ reason: "bad_reason" })
		).article.insert)
			.toMatchObject({
				searchNotFoundReason: "bad_reason"
			});
	});

	it('reducer add selected document id', () => {
		expect(reducers(
			getFullState(),
			operators.setSelectedDocumentId({ id: "doc_id" })
		).article.insert)
			.toMatchObject({
				selectedDocumentIds: { doc_id: true }
			});
	});

	it('reducer remove selected document id', () => {
		expect(reducers(
			getFullState({ article: { insert: { selectedDocumentIds: { doc_id: true } } } }),
			operators.setSelectedDocumentId({ id: "doc_id" })
		).article.insert)
			.toMatchObject({
				selectedDocumentIds: {}
			});
	});

	it('saga should set selected feed id', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } } }))
			.put(operators.setSelectedFeed({ id: "feed-id-1", type: "online" }))
			.dispatch(operators.setSelectedFeedId({ id: "feed-id-1" }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				article: {
					insert: {
						selectedFeed: { id: "feed-id-1", type: "online" }
					}
				}
			}))
			.silentRun();
	});

	it('saga should check valid url', () => {
		const url = "http://gironafc.cat";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ article: { insert: { url } } }))
			.put(operators.setUrlError({ invalidError: false }))
			.dispatch(operators.checkUrl())
			.hasFinalState(getFullState({
				article: {
					insert: {
						url,
						invalidUrlError: false
					}
				}
			}))
			.silentRun();
	});

	it('saga should check invalid url', () => {
		const url = "verybad_url";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ article: { insert: { url } } }))
			.put(operators.setUrlError({ invalidError: 'error.url_not_valid' }))
			.dispatch(operators.checkUrl())
			.hasFinalState(getFullState({
				article: {
					insert: {
						url,
						invalidUrlError: 'error.url_not_valid'
					}
				}
			}))
			.silentRun();
	});

	it('saga should change to step 1', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ article: { insert: { step: "FILL_FORM" } } }))
			.put(operators.setStep({ step: "SELECT_FEED" }))
			.dispatch(operators.changeStep({ step: "SELECT_FEED" }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						step: "SELECT_FEED"
					}
				}
			}))
			.silentRun();
	});

	it('saga should change to step 2 with fail API request', () => {
		const error = new Error();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: { insert: { ...selectedFeedInsertStore, step: "SELECT_FEED" } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)]
			])
			.put(operators.changeStepError({ error }))
			.dispatch(operators.changeStep({ step: "SELECT_FOUND_DOCUMENTS" }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: {
					insert: {
						...selectedFeedInsertStore,
						step: "SELECT_FEED",
						loading: false
					}
				}
			}))
			.silentRun();
	});

	it('saga should change to step 2 with invalid url', () => {
		const badUrl = "not_valid@urlnotvalid";
		const errorReason = "obvious_reason";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: { insert: { ...selectedFeedInsertStore, step: "SELECT_FEED", url: badUrl } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), { valid: false, reason: errorReason }]
			])
			.put(operators.setLoading({ loading: true }))
			.put(operators.setUrlError({ invalidError: 'insert_article.modal.url_error.' + errorReason }))
			.put(operators.setLoading({ loading: false }))
			.dispatch(operators.changeStep({ step: "SELECT_FOUND_DOCUMENTS" }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: {
					insert: {
						...selectedFeedInsertStore,
						step: "SELECT_FEED",
						loading: false,
						url: badUrl,
						invalidUrlError: 'insert_article.modal.url_error.' + errorReason
					}
				}
			}))
			.silentRun();
	});

	it('saga should change to fill form when url is instagram story', () => {
		const igStoryUrl = "https://www.instagram.com/stories/carlespuigdemont/";
		const errorReason = "story";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: { insert: { ...selectedSocialFeedInsertStore, step: "SELECT_FEED", url: igStoryUrl } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), { valid: false, reason: errorReason }]
			])
			.put(operators.setLoading({ loading: true }))
			.put(operators.setStep({ step: "FILL_FORM" }))
			.put(operators.setValidUrl({ url: igStoryUrl }))
			.put(operators.setLoading({ loading: false }))
			.dispatch(operators.changeStep({ step: "SELECT_FOUND_DOCUMENTS" }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: {
					insert: {
						...selectedSocialFeedInsertStore,
						step: "FILL_FORM",
						loading: false,
						url: igStoryUrl,
						validUrl: igStoryUrl
					}
				}
			}))
			.silentRun();
	});

	const insertDocSearchTests = [
		{
			text: "saga should change to step 2 with document found in historical",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				const params = args[1].params;
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/search") {
					if (params[FocusFeedsGroupKey]) return { documents: [] };
					return { documents: [] };
				} else { return { documents: ["doc-id-1"] }; }
			},
			documentsApiMock: ({ args }: any) => {
				if (!args[1] || !args[1].data) return [];
				return __getFakeDoc(args[1].data.documents);
			},
			historicalDocuments: __getFakeDoc([{ id: 'doc-id-1', highlight: '' }]),
			tenantDocuments: [],
			feedDocuments: [],
			insertStoreExtraData: {}
		},
		{
			text: "saga should change to step 2 with document found in tenant",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				const params = args[1].params;
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl };
				else if (path === "/documents/search") {
					if (params[FocusFeedsGroupKey]) return { documents: [] };
					return { documents: ["doc-id-1"] };
				} else { return { documents: [] }; }
			},
			documentsApiMock: ({ args }: any) => {
				if (!args[1] || !args[1].data) return [];
				return __getFakeDoc(args[1].data.documents);
			},
			historicalDocuments: [],
			tenantDocuments: __getFakeDoc([{ id: 'doc-id-1', highlight: '' }]),
			feedDocuments: [],
			insertStoreExtraData: {}
		},
		{
			text: "saga should change to step 2 with document found in feed",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				const params = args[1].params;
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/search") {
					if (params[FocusFeedsGroupKey]) return { documents: ["doc-id-1"] };
					return { documents: [] };
				} else { return { documents: [] }; }
			},
			documentsApiMock: ({ args }: any) => {
				if (!args[1] || !args[1].data) return [];
				return __getFakeDoc(args[1].data.documents);
			},
			historicalDocuments: [],
			tenantDocuments: [],
			feedDocuments: __getFakeDoc([{ id: 'doc-id-1', highlight: '' }]),
			insertStoreExtraData: {}
		},
		{
			text: "saga should change to step 2 with social document found in historical",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				const params = args[1].params;
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/search") {
					if (params[FocusFeedsGroupKey]) return { documents: [] };
					return { documents: [] };
				} else { return { documents: ["doc-id-1"] }; }
			},
			documentsApiMock: ({ args }: any) => {
				if (!args[1] || !args[1].data) return [];
				return __getFakeDoc(args[1].data.documents);
			},
			historicalDocuments: __getFakeDoc([{ id: 'doc-id-1', highlight: '' }]),
			tenantDocuments: [],
			feedDocuments: [],
			insertStoreExtraData: { selectedFeed: { url: "http://gironafc.cat", type: "socialmedia" } }
		},
		{
			text: "saga should change to step 2 with social document found in tenant",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				const params = args[1].params;
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/search") {
					if (params[FocusFeedsGroupKey]) return { documents: [] };
					return { documents: ["doc-id-1"] };
				} else { return { documents: [] }; }
			},
			documentsApiMock: ({ args }: any) => {
				if (!args[1] || !args[1].data) return [];
				return __getFakeDoc(args[1].data.documents);
			},
			historicalDocuments: [],
			tenantDocuments: __getFakeDoc([{ id: 'doc-id-1', highlight: '' }]),
			feedDocuments: [],
			insertStoreExtraData: { selectedFeed: { url: "http://gironafc.cat", type: "socialmedia" } }
		},
		{
			text: "saga should change to step 2 with social document found in feed",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				const params = args[1].params;
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl };
				else if (path === "/documents/search") {
					if (params[FocusFeedsGroupKey]) return { documents: ["doc-id-1"] };
					return { documents: [] };
				} else { return { documents: [] }; }
			},
			documentsApiMock: ({ args }: any) => {
				if (!args[1] || !args[1].data) return [];
				return __getFakeDoc(args[1].data.documents);
			},
			historicalDocuments: [],
			tenantDocuments: [],
			feedDocuments: __getFakeDoc([{ id: 'doc-id-1', highlight: '' }]),
			insertStoreExtraData: { selectedFeed: { url: "http://gironafc.cat", type: "socialmedia" } }
		},
		{
			text: "saga should change to step 2 with social document found in socialmedia API",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/socialMediaSearch") {
					return { id: "doc-id-1" };
				} else return [];
			},
			documentsApiMock: ({ args }: any) => {
				if (!args[1] || !args[1].data) return [];
				return __getFakeDoc(args[1].data.documents);
			},
			historicalDocuments: __getFakeDoc([{ id: 'doc-id-1', highlight: '' }]),
			tenantDocuments: [],
			feedDocuments: [],
			insertStoreExtraData: { selectedFeed: { url: "http://gironafc.cat", type: "socialmedia" } }
		}
	];

	for (const test of insertDocSearchTests) {
		it(test.text, () => {
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
					article: { insert: { ...selectedFeedInsertStore, ...test.insertStoreExtraData, step: "SELECT_FEED" } }
				}))
				.provide([
					[matchers.call.fn(Api.prototype.get), dynamic(test.searchApiMock)],
					[matchers.call.fn(Api.prototype.post), dynamic(test.documentsApiMock)]
				])
				.put(operators.setLoading({ loading: true }))
				.put(operators.setValidUrl({ url: serverValidatedUrl }))
				.put(operators.setLoading({ loading: false }))
				.put(operators.setHistoricalDocuments({ historicalDocuments: test.historicalDocuments }))
				.put(operators.setFeedDocuments({ feedDocuments: test.feedDocuments }))
				.put(operators.setTenantDocuments({ tenantDocuments: test.tenantDocuments }))
				.put(operators.setStep({ step: "SELECT_FOUND_DOCUMENTS" }))
				.dispatch(operators.changeStep({ step: "SELECT_FOUND_DOCUMENTS" }))
				.hasFinalState(getFullState({
					app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
					article: {
						insert: {
							...selectedFeedInsertStore,
							...test.insertStoreExtraData,
							step: "SELECT_FOUND_DOCUMENTS",
							loading: false,
							validUrl: serverValidatedUrl,
							feedDocuments: test.feedDocuments,
							tenantDocuments: test.tenantDocuments,
							historicalDocuments: test.historicalDocuments,
							searchNotFoundReason: null
						}
					}
				}))
				.silentRun();
		});
	}

	const insertDocSearchNotFoundTests = [
		{
			text: "saga should change to step 2 with not social document found",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/search") return { documents: [] };
				else if (path === "/documents") return { documents: [] };
				else if (path === "/documents/socialMediaSearch") return { error: { code: 'social_error' } };
			},
			insertStoreExtraData: { selectedFeed: { url: "http://gironafc.cat", type: "socialmedia" } },
			error: "social_error",
			nextStep: "SELECT_FOUND_DOCUMENTS" as InsertDocumentStep
		},
		{
			text: "saga should change to step 2 with not social document returned by search api found in database",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/search") return { documents: [] };
				else if (path === "/documents") return [];
				else if (path === "/documents/socialMediaSearch") return { id: "doc-not-in-bdd" };
			},
			insertStoreExtraData: { selectedFeed: { url: "http://gironafc.cat", type: "socialmedia" } },
			error: "not_found",
			nextStep: "FILL_FORM" as InsertDocumentStep
		},
		{
			text: "saga should change to step 2 with not online document found",
			searchApiMock: ({ args }: any) => {
				const path = args[0];
				if (path === "/documents/urlCheck") return { valid: true, url: serverValidatedUrl, provider: "0,1,2,3,4,5,12,23" };
				else if (path === "/documents/search") return { documents: [] };
				else if (path === "/documents") return { documents: [] };
			},
			insertStoreExtraData: {},
			error: "missing_online_document",
			nextStep: "FILL_FORM" as InsertDocumentStep
		}
	];

	for (const test of insertDocSearchNotFoundTests) {
		it(test.text, () => {
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
					article: { insert: { ...selectedFeedInsertStore, ...test.insertStoreExtraData, step: "SELECT_FEED" } }
				}))
				.provide([
					[matchers.call.fn(Api.prototype.get), dynamic(test.searchApiMock)],
					[matchers.call.fn(Api.prototype.post), dynamic(test.searchApiMock)]
				])
				.put(operators.setLoading({ loading: true }))
				.put(operators.setValidUrl({ url: serverValidatedUrl }))
				.put(operators.setLoading({ loading: false }))
				.put(operators.setDocumentNotFoundReason({ reason: test.error }))
				.put(operators.setStep({ step: test.nextStep }))
				.dispatch(operators.changeStep({ step: "SELECT_FOUND_DOCUMENTS" }))
				.hasFinalState(getFullState({
					app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
					article: {
						insert: {
							...selectedFeedInsertStore,
							...test.insertStoreExtraData,
							step: test.nextStep,
							loading: false,
							validUrl: serverValidatedUrl,
							searchNotFoundReason: test.error
						}
					}
				}))
				.silentRun();
		});
	}

	const insertPrintDocSearchTests = [
		{ printSelectedFeed: { id: "print-id", type: "print" } },
		{ printSelectedFeed: { id: "print-id", type: "print_percolator" } }
	];

	for (const test of insertPrintDocSearchTests) {
		it('saga should change to step 2 with a print feed of type ' + test.printSelectedFeed.type, () => {
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
					article: { insert: { ...selectedFeedInsertStore, step: "SELECT_FEED", selectedFeed: test.printSelectedFeed } }
				}))
				.put(operators.setStep({ step: "FILL_FORM" }))
				.dispatch(operators.changeStep({ step: "SELECT_FOUND_DOCUMENTS" }))
				.hasFinalState(getFullState({
					app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
					article: {
						insert: {
							...selectedFeedInsertStore,
							selectedFeed: test.printSelectedFeed,
							step: "FILL_FORM"
						}
					}
				}))
				.silentRun();
		});
	}

	it('insert document does nothigng if no selectedDocument', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: { insert: { ...insertDocumentStore, selectedDocumentIds: {}, step: "SELECT_FOUND_DOCUMENTS" } }
			}))
			.dispatch(operators.changeStep({ step: "INSERT_DOCUMENTS" }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: {
					insert: {
						...insertDocumentStore,
						selectedDocumentIds: {},
						step: "SELECT_FOUND_DOCUMENTS"
					}
				}
			}))
			.silentRun();
	});

	it('insert document works properly', () => {
		const test = {
			putApiMock: () => { return; },
			nextStep: 'INSERT_DOCUMENTS' as InsertDocumentStep
		};

		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: { insert: { ...insertDocumentStore, step: "SELECT_FOUND_DOCUMENTS" } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), dynamic(test.putApiMock)]
			])
			.dispatch(operators.changeStep({ step: "INSERT_DOCUMENTS" }))
			.put(operators.setLoading({ loading: true }))
			.put(operators.setStep({ step: test.nextStep }))
			.put(notificationsOperators.add({ notification: { t: "insert_article.success", level: "success" } }))
			.put(operators.setLoading({ loading: false }))
			.put(insertOperators.setShowDialog({ show: false }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: {
					insert: {
						...insertDocumentStore,
						step: "SELECT_FEED",
						selectedFeed: null,
						selectedDocumentIds: {},
						url: '',
						loading: false
					}
				}
			}))
			.silentRun();
	});

	it('insert document fails properly', () => {
		const test = {
			error: new Error("SOME_ERROR_HAPPENED"),
			nextStep: 'INSERT_DOCUMENTS' as InsertDocumentStep
		};

		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: { insert: { ...insertDocumentStore, step: "SELECT_FOUND_DOCUMENTS" } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.put), throwError(test.error)]
			])
			.dispatch(operators.changeStep({ step: "INSERT_DOCUMENTS" }))
			.put(operators.changeStepError({ error: test.error }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: {
					insert: {
						...insertDocumentStore,
						step: "SELECT_FOUND_DOCUMENTS",
						loading: false
					}
				}
			}))
			.silentRun();
	});

	it('Change step with not catched step does nothing', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: { insert: { ...insertDocumentStore, step: "INSERT_DOCUMENTS" } }
			}))
			.dispatch(operators.changeStep({ step: "FILL_FORM" }))
			.put(operators.changeStepError({ error: {} }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				article: {
					insert: {
						...insertDocumentStore,
						step: "INSERT_DOCUMENTS",
						loading: false
					}
				}
			}))
			.silentRun();
	});

	it('Create online document', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...createOnlineDocumentStore, step: "FILL_FORM" } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: onlineForm }))
			.put(operators.setLoading({ loading: true }))
			.put(operators.setShowDialog({ show: false }))
			.put(notificationsOperators.add({ notification: { t: "insert_article.success", level: "success" } }))
			.put(searchOperators.fetchSearch())
			.provide([
				[matchers.call.fn(Api.prototype.post), { CLAU: 1234 }],
				[matchers.call.fn(Api.prototype.put), { added: 1 }]
			])
			.hasFinalState(getFullState({
				article: {
					insert: {
						url: '',
						step: "SELECT_FEED"
					}
				},
				search: {
					results: {
						loadingDocuments: true
					}
				}
			}))
			.silentRun();
	});

	it('Create print document', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...createPrintDocumentStore, step: "FILL_FORM" } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: printForm }))
			.put(operators.setLoading({ loading: true }))
			.put(operators.setShowDialog({ show: false }))
			.put(notificationsOperators.add({ notification: { t: "insert_article.success", level: "success" } }))
			.provide([
				[matchers.call.fn(Api.prototype.post), { CLAU: 1234 }],
				[matchers.call.fn(Api.prototype.put), { added: 1 }]
			])
			.hasFinalState(getFullState({
				article: {
					insert: {
						url: '',
						step: "SELECT_FEED"
					}
				},
				search: {
					results: {
						loadingDocuments: true
					}
				}
			}))
			.silentRun();
	});

	it('Create document empty form case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...createPrintDocumentStore, step: "FILL_FORM" } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: undefined }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						...createPrintDocumentStore,
						step: "FILL_FORM"
					}
				}
			}))
			.silentRun();
	});

	it('Create document no feed case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...createPrintDocumentStore, selectedFeed: {}, step: "FILL_FORM" } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: printForm }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						...createPrintDocumentStore,
						selectedFeed: {},
						step: "FILL_FORM"
					}
				}
			}))
			.silentRun();
	});

	it('Create online document and no url case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...createOnlineDocumentStore, step: "FILL_FORM", validUrl: '' } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: onlineForm }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						...createOnlineDocumentStore,
						url: '',
						validUrl: '',
						step: "FILL_FORM"
					}
				}
			}))
			.silentRun();
	});

	it('Create document with old print feed', () => {
		const oldPrintDocument = { ...createPrintDocumentStore, selectedFeed: { ...createPrintDocumentStore.selectedFeed, type: "print" } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...oldPrintDocument, type: "print", step: "FILL_FORM", validUrl: '' } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: onlineForm }))
			.hasFinalState(getFullState({
				article: { insert: { ...oldPrintDocument, type: "print", step: "FILL_FORM", validUrl: '' } }
			}))
			.silentRun();
	});

	it('Create document with tags', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...createOnlineDocumentStore, step: "FILL_FORM" } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: { ...onlineForm, category: '', tags: onlineForm.tags.add('test') } }))
			.put(operators.setLoading({ loading: true }))
			.put(operators.setShowDialog({ show: false }))
			.put(notificationsOperators.add({ notification: { t: "insert_article.success", level: "success" } }))
			.call.fn(Api.prototype.put)
			.provide([
				[matchers.call.fn(Api.prototype.post), { CLAU: 1234 }],
				[matchers.call.fn(Api.prototype.put), { added: 1 }]
			])
			.hasFinalState(getFullState({
				article: {
					insert: {
						url: '',
						step: "SELECT_FEED"
					}
				},
				search: {
					results: {
						loadingDocuments: true
					}
				}
			}))
			.silentRun();
	});

	it('Create document api error case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: { insert: { ...createOnlineDocumentStore, step: "FILL_FORM" } }
			}))
			.dispatch(operators.changeStep({ step: "CREATE_DOCUMENT", form: onlineForm }))
			.put(operators.setLoading({ loading: true }))
			.put(operators.changeStepError({ error: new Error('SOMETHING_HAPPENED') }))
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(new Error('SOMETHING_HAPPENED'))]
			])
			.hasFinalState(getFullState({
				article: {
					insert: {
						...createOnlineDocumentStore,
						url: '',
						step: "FILL_FORM",
						showDialog: false
					}
				}
			}))
			.silentRun();
	});
});
