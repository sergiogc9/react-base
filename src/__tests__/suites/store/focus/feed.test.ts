import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';
import { push } from 'connected-react-router';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';

import Api from '@src/lib/ajax/Api';
import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas, INITIAL_STATE as FEED_INITIAL_STATE, FocusFeedStateDefinitions } from '@src/store/focus/feed';
import { operators as notificationsOperators } from '@src/store/app/notifications';
import { operators as filtersOperators } from '@src/store/search/filters';
import { operators as resultsOperators } from '@src/store/search/results';
import { State } from '@src/store/types';
import { FeedObject, DefinitionSocial } from '@src/class/Feed';
import { resetSearchData } from '@src/store/search';
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const user = TestHelper.getUser();

const focusFakeId = "focus-id-1";
const focus2FakeId = "focus-id-2";
const focusFakeName = "focus fake name";
const feed: FeedObject = {
	definition: FEED_INITIAL_STATE.social.definition,
	deleted_at: new Date(1549287550563),
	enabled: true,
	filters: {},
	focus_id: focusFakeId,
	id: "feed-id-1",
	inserted_at: new Date(1549287550563),
	name: "feed-name-1",
	type: "socialmedia",
	updated_at: new Date(1549287550563)
};

const dupFeed: FeedObject = {
	...feed,
	id: "feed-dup-id-1",
	name: "feed-dup-name-1",
	focus_id: focus2FakeId
};

const feedWithFilters: FeedObject = {
	...feed,
	filters: { channel_type_id: ["10", "30"] }
};

const initialDefinitions: FocusFeedStateDefinitions = {
	social: FEED_INITIAL_STATE.social
};

const definitions: FocusFeedStateDefinitions = {
	social: {
		...FEED_INITIAL_STATE.social,
		definition: {
			...FEED_INITIAL_STATE.social.definition,
			main: {
				...FEED_INITIAL_STATE.social.definition.main,
				q: "fake"
			}
		}
	}
};

const error = new Error();

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Focus feed store', () => {

	beforeAll(() => {
		// TODO: remove when online and print definition pages are implemented
		Object.defineProperty(window.location, 'assign', {
			configurable: true
		});
		window.location.assign = jest.fn();
	});

	it('reducer set initial feed', () => {
		expect(reducers(
			getFullState({ focus: { feed: { feedId: "id", feedName: "name", feedType: "socialmedia", focusId: "id2", feedEnabled: true } } }),
			operators.setInitialFeed({ feedType: "print_percolator", focusId: focusFakeId, definitions })
		).focus.feed)
			.toMatchObject({
				...FEED_INITIAL_STATE,
				feedType: "print_percolator",
				focusId: focusFakeId,
				...definitions
			});
	});

	it('reducer fetch feed error', () => {
		expect(reducers(
			getFullState({ focus: { feed: { feedId: "id", feedName: "name", feedType: "socialmedia", focusId: "id2", feedEnabled: true } } }),
			operators.fetchFeedError({ error })
		).focus.feed)
			.toMatchObject({
				feedId: null,
				feedName: null,
				feedType: null,
				focusId: null,
				feedEnabled: false,
				feedChanged: false
			});
	});

	it('reducer set feed', () => {
		expect(reducers(
			getFullState({ focus: { feed: { feedId: "id", feedName: "name", feedType: "socialmedia", focusId: "id2", feedEnabled: true } } }),
			operators.setFeed({ feed, definitions })
		).focus.feed)
			.toMatchObject({
				feedId: feed.id,
				feedName: feed.name,
				feedType: feed.type,
				focusId: feed.focus_id,
				feedEnabled: feed.enabled,
				...definitions
			});
	});

	it('reducer set edit name input value', () => {
		expect(reducers(
			getFullState(),
			operators.setEditNameInputValue({ feedName: "fee" })
		).focus.feed)
			.toMatchObject({
				editNameInputValue: "fee"
			});
	});

	it('reducer set loading save feed', () => {
		expect(reducers(
			getFullState(),
			operators.setLoadingSaveFeed({ loading: true })
		).focus.feed)
			.toMatchObject({
				loadingSaveFeed: true
			});
	});

	it('reducer set loading save feed name', () => {
		expect(reducers(
			getFullState(),
			operators.setLoadingSaveFeedName({ loading: true })
		).focus.feed)
			.toMatchObject({
				loadingSaveFeedName: true
			});
	});

	it('reducer save feed name error', () => {
		expect(reducers(
			getFullState({ focus: { feed: { loadingSaveFeedName: true } } }),
			operators.saveFeedNameError({ error: {} })
		).focus.feed)
			.toMatchObject({
				loadingSaveFeedName: false
			});
	});

	it('reducer save feed name', () => {
		expect(reducers(
			getFullState({ focus: { feed: { feedName: "feed-old" } } }),
			operators.saveFeedNameSuccess({ feedName: "feed-new" })
		).focus.feed)
			.toMatchObject({
				feedName: "feed-new"
			});
	});

	it('reducer toggle feed enabled', () => {
		expect(reducers(
			getFullState(),
			operators.toggleFeedEnabled()
		).focus.feed)
			.toMatchObject({
				feedEnabled: true,
				feedChanged: true
			});
	});

	it('reducer recover feed success', () => {
		expect(reducers(
			getFullState(),
			operators.recoverFeedSuccess({ recoveryId: "2300" })
		).focus.feed)
			.toMatchObject({
				recoveryId: "2300"
			});
	});

	it('reducer recover polling start', () => {
		expect(reducers(
			getFullState({ focus: { feed: { recoveryProgress: 20 } } }),
			operators.recoverPollingStart()
		).focus.feed)
			.toMatchObject({
				recoveryProgress: 0
			});
	});

	it('reducer set recover progress', () => {
		expect(reducers(
			getFullState({ focus: { feed: { recoveryProgress: 20 } } }),
			operators.setRecoverPollingProgress({ progress: 30 })
		).focus.feed)
			.toMatchObject({
				recoveryProgress: 30
			});
	});

	it('reducer toggle show duplicate feed', () => {
		expect(reducers(
			getFullState({ focus: { feed: { dupFeedId: "feed-id" } } }),
			operators.toggleShowDuplicateFeed()
		).focus.feed)
			.toMatchObject({
				showDuplicateFeed: true,
				duplicatedFeedId: null
			});
	});

	it('reducer duplicate feed start', () => {
		expect(reducers(
			getFullState({ focus: { feed: { loadingDuplicateFeed: false } } }),
			operators.duplicateFeedStart({ feedName: "feed-name", focusId: "focus-id" })
		).focus.feed)
			.toMatchObject({
				loadingDuplicateFeed: true
			});
	});

	it('reducer duplicate feed success', () => {
		expect(reducers(
			getFullState({ focus: { feed: { loadingDuplicateFeed: true } } }),
			operators.duplicateFeedSuccess({ feedId: "dup-feed-id" })
		).focus.feed)
			.toMatchObject({
				loadingDuplicateFeed: false,
				duplicatedFeedId: "dup-feed-id"
			});
	});

	it(`saga should reset social feed`, () => {
		const returnedDefinitions = initialDefinitions;
		returnedDefinitions.social.definition.main.q = focusFakeName;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.call(resetSearchData)
			.put(operators.setInitialFeed({ focusId: focusFakeId, feedType: "socialmedia", definitions: returnedDefinitions }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.resetFeed({ focusId: focusFakeId, focusName: focusFakeName, feedType: "socialmedia" }))
			.hasFinalState(getFullState({
				search: { results: { loadingDocuments: true } },
				focus: {
					feed: {
						feedId: null,
						feedName: null,
						feedType: "socialmedia",
						focusId: focusFakeId,
						feedEnabled: false,
						...returnedDefinitions
					}
				}
			}))
			.silentRun();
	});

	it(`saga should reset online feed`, () => {
		const returnedDefinitions = initialDefinitions;
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.call(resetSearchData)
			.put(operators.setInitialFeed({ focusId: focusFakeId, feedType: "online", definitions: returnedDefinitions }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.resetFeed({ focusId: focusFakeId, focusName: focusFakeName, feedType: "online" }))
			.hasFinalState(getFullState({
				search: { results: { loadingDocuments: true } },
				focus: {
					feed: {
						feedId: null,
						feedName: null,
						feedType: "online",
						focusId: focusFakeId,
						feedEnabled: false,
						...returnedDefinitions
					}
				}
			}))
			.silentRun();
	});

	it(`saga should fetch an online feed`, () => {
		const onlineFeed: FeedObject = { ...feed, type: "online" };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: { tier_properties: { results: { social: true } } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), onlineFeed]
			])
			.call(resetSearchData)
			.not.put(operators.setFeed({ feed: onlineFeed, definitions }))
			.dispatch(operators.fetchFeed({ focusId: focusFakeId, feedId: onlineFeed.id }))
			.hasFinalState(getFullState({
				app: { profile: { tenant: { tier_properties: { results: { social: true } } } } },
				focus: {
					feed: {
						feedId: null,
						feedName: null,
						feedType: null,
						focusId: null,
						feedEnabled: false
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should fetch a socialmedia feed`, () => {
		const socialFeed: FeedObject = { ...feed, type: "socialmedia", definition: definitions.social.definition };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: { tier_properties: { results: { social: true } } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), socialFeed]
			])
			.put(operators.checkRecovery())
			.put(operators.setFeed({ feed: socialFeed, definitions }))
			.dispatch(operators.fetchFeed({ focusId: focusFakeId, feedId: socialFeed.id }))
			.hasFinalState(getFullState({
				app: { profile: { tenant: { tier_properties: { results: { social: true } } } } },
				focus: {
					feed: {
						feedId: socialFeed.id,
						feedName: socialFeed.name,
						feedType: socialFeed.type,
						focusId: socialFeed.focus_id,
						feedEnabled: socialFeed.enabled,
						...definitions
					}
				},
				search: { results: { loadingDocuments: true } }
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should fetch a socialmedia feed with filters`, () => {
		const socialFeed: FeedObject = { ...feedWithFilters, type: "socialmedia", definition: definitions.social.definition };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: { tier_properties: { results: { social: true } } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), socialFeed]
			])
			.put(operators.checkRecovery())
			.put(filtersOperators.setFacetFilters({ facetsGroups: { channel_type_id: [{ key: "10" }, { key: "30" }] } }))
			.put(operators.setFeed({ feed: socialFeed, definitions }))
			.dispatch(operators.fetchFeed({ focusId: focusFakeId, feedId: socialFeed.id }))
			.hasFinalState(getFullState({
				app: { profile: { tenant: { tier_properties: { results: { social: true } } } } },
				focus: {
					feed: {
						feedId: socialFeed.id,
						feedName: socialFeed.name,
						feedType: socialFeed.type,
						focusId: socialFeed.focus_id,
						feedEnabled: socialFeed.enabled,
						...definitions
					}
				},
				search: { results: { loadingDocuments: true }, filters: { facetsGroups: { channel_type_id: [{ key: "10" }, { key: "30" }] } } }
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should fetch a socialmedia feed without social tier`, () => {
		const socialFeed: FeedObject = { ...feed, type: "socialmedia" };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: { tier_properties: { results: {} } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), socialFeed]
			])
			.call(resetSearchData)
			.put(notificationsOperators.add({ notification: { t: "error.page_not_found", level: "warning" } }))
			.put(push(`/focus/${focusFakeId}`))
			.not.put(operators.setFeed({ feed: socialFeed, definitions }))
			.dispatch(operators.fetchFeed({ focusId: focusFakeId, feedId: socialFeed.id }))
			.hasFinalState(getFullState({
				app: { profile: { tenant: { tier_properties: { results: {} } } } },
				focus: {
					feed: {
						feedId: null,
						feedName: null,
						feedType: null,
						focusId: null,
						feedEnabled: false
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should fetch a print feed`, () => {
		const printFeed: FeedObject = { ...feed, type: "print_percolator" };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: { tier_properties: { results: { social: true } } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), printFeed]
			])
			.call(resetSearchData)
			.not.put(operators.setFeed({ feed: printFeed, definitions }))
			.dispatch(operators.fetchFeed({ focusId: focusFakeId, feedId: printFeed.id }))
			.hasFinalState(getFullState({
				app: { profile: { tenant: { tier_properties: { results: { social: true } } } } },
				focus: {
					feed: {
						feedId: null,
						feedName: null,
						feedType: null,
						focusId: null,
						feedEnabled: false
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should fetch an old print feed`, () => {
		const oldPrintFeed: FeedObject = { ...feed, type: "print" };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: { tier_properties: { results: { social: true } } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), oldPrintFeed]
			])
			.call(resetSearchData)
			.put(notificationsOperators.add({ notification: { t: "error.page_not_found", level: "warning" } }))
			.put(push(`/`))
			.not.put(operators.setFeed({ feed: oldPrintFeed, definitions }))
			.dispatch(operators.fetchFeed({ focusId: focusFakeId, feedId: oldPrintFeed.id }))
			.hasFinalState(getFullState({
				app: { profile: { tenant: { tier_properties: { results: { social: true } } } } },
				focus: {
					feed: {
						feedId: null,
						feedName: null,
						feedType: null,
						focusId: null,
						feedEnabled: false
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should fetch feed with an api error`, () => {
		const socialFeed: FeedObject = { ...feed, type: "socialmedia" };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: { tier_properties: { results: { social: true } } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)]
			])
			.call(resetSearchData)
			.put(operators.fetchFeedError({ error }))
			.not.put(operators.setFeed({ feed: socialFeed, definitions }))
			.dispatch(operators.fetchFeed({ focusId: focusFakeId, feedId: socialFeed.id }))
			.hasFinalState(getFullState({
				app: { profile: { tenant: { tier_properties: { results: { social: true } } } } },
				focus: {
					feed: {
						feedId: null,
						feedName: null,
						feedType: null,
						focusId: null,
						feedEnabled: false
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should save feed name from input value without existing feed`, () => {
		const inputValue = "new-feed-name";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", editNameInputValue: inputValue } } }))
			.provide([
				[matchers.call.fn(Api.prototype.put), {}]
			])
			.put(operators.saveFeedNameSuccess({ feedName: inputValue }))
			.dispatch(operators.saveFeedName())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						editNameInputValue: inputValue,
						feedName: inputValue
					}
				}
			}))
			.silentRun();
	});

	it(`saga should save feed name from input value with existing feed`, () => {
		const inputValue = "new-feed-name";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id", editNameInputValue: inputValue } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.put), {}]
			])
			.put(operators.setLoadingSaveFeedName({ loading: true }))
			.put(operators.saveFeedNameSuccess({ feedName: inputValue }))
			.dispatch(operators.saveFeedName())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						editNameInputValue: inputValue,
						feedName: inputValue
					}
				}
			}))
			.silentRun();
	});

	it(`saga should save feed name from input value with wrong existing feed`, () => {
		const badInputValue = "n";
		const previousFeedName = "old-name";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id", feedName: previousFeedName, editNameInputValue: badInputValue } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.put), {}]
			])
			.put(notificationsOperators.add({ notification: { t: "error.feed_name_too_short", level: "warning" } }))
			.put(operators.setEditNameInputValue({ feedName: previousFeedName }))
			.dispatch(operators.saveFeedName())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						editNameInputValue: previousFeedName,
						feedName: previousFeedName
					}
				}
			}))
			.silentRun();
	});

	it(`saga should save feed name from input value with api call fail`, () => {
		const inputValue = "new-feed-name";
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id", editNameInputValue: inputValue } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.put), throwError(error)]
			])
			.put(operators.setLoadingSaveFeedName({ loading: true }))
			.put(operators.saveFeedNameError({ error }))
			.dispatch(operators.saveFeedName())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						editNameInputValue: inputValue,
						loadingSaveFeedName: false
					}
				}
			}))
			.silentRun();
	});

	it(`saga should check recovery with active recovery`, () => {
		const apiGetMock = ({ args }: any) => {
			const path = args[0];
			if (path.match(/recovery\/202/)) return { progress: 0 };
			else return { recovery_id: "202" };
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id" } } }))
			.provide([
				[matchers.call.fn(Api.prototype.get), dynamic(apiGetMock)]
			])
			.put(operators.recoverFeedSuccess({ recoveryId: "202" }))
			.put(operators.recoverPollingStart())
			.dispatch(operators.checkRecovery())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						recoveryId: "202"
					}
				}
			}))
			.silentRun();
	});

	it(`saga should check recovery without active recovery`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id" } } }))
			.provide([
				[matchers.call.fn(Api.prototype.get), { recovery_id: null }]
			])
			.not.put(operators.recoverPollingStart())
			.dispatch(operators.checkRecovery())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						recoveryId: null
					}
				}
			}))
			.silentRun();
	});

	it(`saga should check recovery with api call error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id" } } }))
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)]
			])
			.put(operators.recoverFeedError({ error }))
			.dispatch(operators.checkRecovery())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						recoveryId: null,
						recoveryProgress: 0
					}
				}
			}))
			.silentRun();
	});

	it(`saga should start recover poll with different percentages`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id", recoveryId: "3049" } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { progress: 1 }]
			])
			.put(operators.setRecoverPollingProgress({ progress: 100 }))
			.dispatch(operators.recoverPollingStart())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						recoveryId: "3049",
						recoveryProgress: 100
					}
				}
			}))
			.silentRun();
	});

	it(`saga should start recover poll with 100% percentage`, () => {
		const provideDelay = ({ fn }: { fn: any }, next: any) => (fn.name === 'delayP') ? null : next();
		let timesCalled = 0;
		const apiGetMock = ({ args }: any) => {
			timesCalled++;
			return timesCalled === 1 ? { progress: 0.25 } : { progress: 1 };
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id", recoveryId: "3049" } } })) // withState always after withReducer
			.provide([
				{ call: provideDelay },
				[matchers.call.fn(Api.prototype.get), dynamic(apiGetMock)]
			])
			.put(operators.setRecoverPollingProgress({ progress: 25 }))
			.put(operators.setRecoverPollingProgress({ progress: 100 }))
			.dispatch(operators.recoverPollingStart())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						recoveryId: "3049",
						recoveryProgress: 100
					}
				}
			}))
			.silentRun();
	});

	it(`saga should start recover poll with failing api call`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { focusId: "focus-id", feedId: "feed-id", recoveryId: "3049" } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)]
			])
			.put(operators.recoverFeedError({ error }))
			.dispatch(operators.recoverPollingStart())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: "focus-id",
						feedId: "feed-id",
						recoveryId: "3049"
					}
				}
			}))
			.silentRun();
	});

	it(`saga should update existing feed`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.put), { ...feed }]
			])
			.put(operators.setFeed({ feed, definitions: initialDefinitions }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.saveFeed())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true,
						...initialDefinitions
					}
				},
				search: { filters: { channel_type_id: ["socialmedia"] }, results: { loadingDocuments: true } }
			}))
			.silentRun();
	});

	it(`saga should create new feed`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: feed.name, feedEnabled: true } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), { ...feed }]
			])
			.put(operators.setFeed({ feed, definitions: initialDefinitions }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.saveFeed())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true,
						...initialDefinitions
					}
				},
				search: { filters: { channel_type_id: ["socialmedia"] }, results: { loadingDocuments: true } }
			}))
			.silentRun();
	});

	it(`saga should save feed with api call error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: feed.name, feedEnabled: true } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.put(operators.saveFeedError({ error }))
			.dispatch(operators.saveFeed())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: feed.name, feedEnabled: true
					}
				},
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.silentRun();
	});

	it(`saga should save feed with check name error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: "a", feedEnabled: true } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), { ...feed }]
			])
			.put(notificationsOperators.add({ notification: { t: 'error.feed_name_too_short', level: "warning" } }))
			.dispatch(operators.saveFeed())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: "a", feedEnabled: true
					}
				},
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.silentRun();
	});

	it(`saga should save feed with inclusive error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: {
					feed: {
						focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: "kketa", feedEnabled: true,
						social: { definition: { main: { q: 'kkaeta', scope: ['tags'], enabled: false } } }
					}
				},
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), { ...feed }]
			])
			.put(operators.toggleFeedEnabled())
			.dispatch(operators.saveFeed())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true
					}
				},
				search: { filters: { channel_type_id: ["socialmedia"] }, results: { loadingDocuments: true } }
			}))
			.silentRun();
	});

	const invalidFeedDefinitionTests = [
		{ text: "main expression", partialDefinition: { main: { enabled: true, q: "girona", scope: ["tags"], error: true } } as Partial<DefinitionSocial> },
		{ text: "include expressions", partialDefinition: { include_expressions: [{ enabled: true, q: "girona", scope: ["tags"], error: true }] } as Partial<DefinitionSocial> },
		{ text: "exclude expressions", partialDefinition: { exclude_expressions: [{ enabled: true, q: "girona", scope: ["tags"], error: true }] } as Partial<DefinitionSocial> },
		{ text: "include profies", partialDefinition: { include_profiles: [{ enabled: true, error: true }] } as Partial<DefinitionSocial> },
		{ text: "exclude profies", partialDefinition: { exclude_profiles: [{ enabled: true, error: true }] } as Partial<DefinitionSocial> },
		{ text: "threshold", partialDefinition: { threshold: { 10: { value: -10, enabled: true } } } as Partial<DefinitionSocial> },
		{ text: "threshold", partialDefinition: { threshold: { 30: { value: 300, enabled: true, error: true } } } as Partial<DefinitionSocial> }
	];

	for (const test of invalidFeedDefinitionTests) {
		it(`saga should save feed with invalid ${test.text}`, () => {
			const definitionState: FocusFeedStateDefinitions = {
				...initialDefinitions,
				social: {
					...initialDefinitions.social,
					definition: {
						...initialDefinitions.social.definition,
						...test.partialDefinition
					}
				}
			};
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					focus: { feed: { focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: feed.name, feedEnabled: true, ...definitionState } },
					search: { filters: { channel_type_id: ["socialmedia"] } }
				}))
				.provide([
					[matchers.call.fn(Api.prototype.post), { ...feed }]
				])
				.put(notificationsOperators.add({ notification: { t: 'feed.form.invalid_expressions', level: "warning" } }))
				.dispatch(operators.saveFeed())
				.hasFinalState(getFullState({
					focus: {
						feed: {
							focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: feed.name, feedEnabled: true,
							...definitionState
						}
					},
					search: { filters: { channel_type_id: ["socialmedia"] } }
				}))
				.silentRun();
		});
	}

	const correctFeedDefinitionTests = [
		{ text: "main expression", partialDefinition: { main: { enabled: true, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] } } as Partial<DefinitionSocial> },
		{
			text: "include expressions", partialDefinition: {
				main: { enabled: false, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] },
				include_expressions: [{ enabled: true, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] }]
			} as Partial<DefinitionSocial>
		},
		{
			text: "exclude expressions", partialDefinition: {
				exclude_expressions: [{ enabled: true, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] }]
			} as Partial<DefinitionSocial>
		},
		{
			text: "include profiles", partialDefinition: {
				main: { enabled: false, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] },
				include_profiles: [{ id: "profile", url: "fake.url", enabled: true }]
			} as Partial<DefinitionSocial>
		},
		{ text: "exclude profiles", partialDefinition: { exclude_profiles: [{ id: "profile", url: "fake.url" }] } as Partial<DefinitionSocial> },
		{
			text: "everything", partialDefinition: {
				main: { enabled: true, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] },
				include_expressions: [{ enabled: true, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] }],
				exclude_expressions: [{ enabled: true, q: "girona", scope: ["title", "content", "instagram.users_in_photo"] }],
				include_profiles: [{ id: "profile", url: "fake.url" }],
				exclude_profiles: [{ id: "profile", url: "fake.url" }]
			} as Partial<DefinitionSocial>
		}
	];

	for (const test of correctFeedDefinitionTests) {
		it(`saga should save feed with valid ${test.text}`, () => {
			const definitionState: FocusFeedStateDefinitions = {
				...initialDefinitions,
				social: {
					...initialDefinitions.social,
					definition: {
						...initialDefinitions.social.definition,
						...test.partialDefinition
					}
				}
			};
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					focus: { feed: { focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: feed.name, feedEnabled: true, ...definitionState } },
					search: { filters: { channel_type_id: ["socialmedia"] } }
				}))
				.provide([
					[matchers.call.fn(Api.prototype.post), { ...feed, definition: { ...initialDefinitions.social.definition, ...test.partialDefinition } }]
				])
				.put(operators.setFeed({ feed: { ...feed, definition: { ...initialDefinitions.social.definition, ...test.partialDefinition } }, definitions: definitionState }))
				.dispatch(operators.saveFeed())
				.hasFinalState(getFullState({
					focus: {
						feed: {
							focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true,
							...definitionState
						}
					},
					search: { filters: { channel_type_id: ["socialmedia"] }, results: { loadingDocuments: true } }
				}))
				.silentRun();
		});
	}

	it(`saga should save social feed not being inclusive`, () => {
		const definitionState: FocusFeedStateDefinitions = {
			...initialDefinitions,
			social: {
				...initialDefinitions.social,
				definition: {
					...initialDefinitions.social.definition,
					main: {
						...initialDefinitions.social.definition.main,
						enabled: true
					}
				}
			}
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: null, feedType: feed.type, feedName: feed.name, feedEnabled: true, ...definitionState } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), { ...feed }]
			])
			.put(operators.setFeed({ feed: { ...feed }, definitions: definitionState }))
			.dispatch(operators.saveFeed())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true,
						...definitionState
					}
				},
				search: { filters: { channel_type_id: ["socialmedia"] }, results: { loadingDocuments: true } }
			}))
			.silentRun();
	});

	it(`saga should recover feed`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), { recovery_id: "120" }]
			])
			.put(operators.recoverFeedSuccess({ recoveryId: "120" }))
			.put(operators.recoverPollingStart())
			.put(notificationsOperators.add({ notification: { t: 'feed.form.recovery.success', level: "success" } }))
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, recoveryId: "120" } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should recover feed with failing API`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.put(operators.recoverFeedError({ error }))
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should recover disabled feed`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: false, feedChanged: false } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), { recovery_id: "120" }]
			])
			.put(notificationsOperators.add({ notification: { t: 'feed.form.recovery.must_enable_feed', level: "info" } }))
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: false, feedChanged: false } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should recover with save needed`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: true } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), { recovery_id: "120" }],
				[matchers.call.fn(Api.prototype.put), { ...feed }]
			])
			.put(operators.recoverFeedSuccess({ recoveryId: "120" }))
			.put(operators.recoverPollingStart())
			.put(notificationsOperators.add({ notification: { t: 'feed.form.recovery.success', level: "success" } }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				// eslint-disable-next-line max-len
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, recoveryId: "120", loadingSaveFeed: false } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] }, results: { loadingDocuments: true } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should recover with wrong feed name`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedType: feed.type, feedName: "a", feedEnabled: true } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), { recovery_id: "120" }]
			])
			.put(notificationsOperators.add({ notification: { t: 'error.feed_name_too_short', level: "warning" } }))
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedType: feed.type, feedName: "a", feedEnabled: true } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should recover social feed without empty instagram accounts`, () => {
		const definitionState: FocusFeedStateDefinitions = {
			...initialDefinitions,
			social: {
				...initialDefinitions.social,
				definition: {
					...initialDefinitions.social.definition,
					instagram_accounts: [{ id: "ig1", screen_name: "gironafc", linkedExpression: { type: "main", index: 0 } }]
				}
			}
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, ...definitionState } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), { recovery_id: "120" }]
			])
			.put(notificationsOperators.add({ notification: { t: 'feed.form.recovery.not_available_due_to_mentions_api', level: "info" } }))
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, ...definitionState } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should recover social feed not being inclusive`, () => {
		const definitionState: FocusFeedStateDefinitions = {
			...initialDefinitions,
			social: {
				...initialDefinitions.social,
				definition: {
					...initialDefinitions.social.definition,
					main: {
						...initialDefinitions.social.definition.main,
						enabled: false
					}
				}
			}
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, ...definitionState } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), { recovery_id: "120" }]
			])
			.put(notificationsOperators.add({ notification: { t: 'feed.form.preview.no_inclusive_terms_social_feed', level: "info" } }))
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, ...definitionState } },
				search: { form: { period: "last_week" }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should recover social feed not in date range`, () => {
		const definitionState: FocusFeedStateDefinitions = {
			...initialDefinitions,
			social: {
				...initialDefinitions.social,
				definition: {
					...initialDefinitions.social.definition,
					main: {
						...initialDefinitions.social.definition.main,
						q: "girona"
					}
				}
			}
		};
		const now = new Date();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, ...definitionState } },
				search: { form: { period: "custom", begin_date: new Date(0), end_date: now }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), { recovery_id: "120" }]
			])
			.put(notificationsOperators.add({ notification: { t: 'error.search_period.more_than_3_months', level: "info" } }))
			.dispatch(operators.recoverFeed())
			.hasFinalState(getFullState({
				focus: { feed: { focusId: feed.focus_id, feedId: feed.id, feedType: feed.type, feedName: feed.name, feedEnabled: true, feedChanged: false, ...definitionState } },
				search: { form: { period: "custom", begin_date: new Date(0), end_date: now }, filters: { channel_type_id: ["socialmedia"] } },
				app: { profile: { user } }
			}))
			.silentRun();
	});

	it(`saga should duplicate feed`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: {
					feed: {
						feedId: feed.id,
						feedEnabled: true,
						feedName: feed.name,
						focusId: feed.focus_id,
						social: {
							definition: {
								main: {
									q: 'kketa',
									scope: ['tags'],
									enabled: true
								}
							}
						}
					}
				}
			}))
			.put(operators.toggleShowDuplicateFeed())
			.dispatch(operators.duplicateFeed())
			.hasFinalState(getFullState({
				focus: {
					feed: {
						feedId: feed.id,
						feedEnabled: false,
						feedName: feed.name,
						focusId: feed.focus_id,
						feedChanged: true,
						showDuplicateFeed: true,
						social: {
							definition: {
								main: {
									q: 'kketa',
									scope: ['tags'],
									enabled: true
								}
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it(`saga should duplicate feed with wrong feed name`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { feedName: "b", feedEnabled: true } } }))
			.provide([
				[matchers.call.fn(Api.prototype.post), { ...feed }]
			])
			.put(notificationsOperators.add({ notification: { t: 'error.feed_name_too_short', level: "warning" } }))
			.dispatch(operators.duplicateFeed())
			.hasFinalState(getFullState({
				focus: { feed: { feedName: "b", feedEnabled: true } }
			}))
			.silentRun();
	});

	it(`saga should duplicate feed with save feed api call fail`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { feedName: feed.name, feedEnabled: true } } }))
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.put(operators.duplicateFeedError({ error: { code: "FEED_DEFINITION_ERROR" } }))
			.not.put(operators.toggleShowDuplicateFeed())
			.dispatch(operators.duplicateFeed())
			.hasFinalState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: false, feedChanged: true } }
			}))
			.silentRun();
	});

	it(`saga should start duplicate feed`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: true } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), { ...dupFeed }]
			])
			.put(operators.duplicateFeedSuccess({ feedId: dupFeed.id }))
			.put(notificationsOperators.add({ notification: { t: 'feed.form.duplicate.dupped_ok', level: "info" } }))
			.dispatch(operators.duplicateFeedStart({ feedName: dupFeed.name, focusId: dupFeed.focus_id }))
			.hasFinalState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: true, duplicatedFeedId: dupFeed.id } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.silentRun();
	});

	it(`saga should start duplicate feed with api call error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: true } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.put(operators.duplicateFeedError({ error }))
			.dispatch(operators.duplicateFeedStart({ feedName: dupFeed.name, focusId: dupFeed.focus_id }))
			.hasFinalState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: true, duplicatedFeedId: null, loadingDuplicateFeed: false } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.silentRun();
	});

	it(`saga shouldn't fetch search with a social definition`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: true, feedType: "socialmedia", social: { definition: { main: { q: '', enabled: true, scope: ['tags'] } } } } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.put(notificationsOperators.add({ notification: { t: `feed.form.preview.no_inclusive_terms_social_feed`, level: "info" } }))
			.dispatch(operators.fetchSearch())
			.silentRun();
	});

	it(`saga shouldn't fetch search with a online definition`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: true, feedType: "online", social: { definition: { main: { q: '', enabled: true, scope: ['tags'] } } } } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.put(notificationsOperators.add({ notification: { t: `feed.form.preview.no_inclusive_terms_online_feed`, level: "info" } }))
			.dispatch(operators.fetchSearch())
			.silentRun();
	});

	it(`saga should fetch search`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				focus: { feed: { feedName: feed.name, feedEnabled: true, feedType: "socialmedia", social: { definition: { main: { q: 'test', enabled: true, scope: ['tags'] } } } } },
				search: { filters: { channel_type_id: ["socialmedia"] } }
			}))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.fetchSearch())
			.silentRun();
	});
});
