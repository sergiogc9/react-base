import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/search/facets';
import { INITIAL_STATE as EXTENDED_INITIAL_STATE } from '@src/store/search/facets/extended';
import Api from '@src/lib/ajax/Api';

import { State } from '@src/store/types';
import { FacetObject, APIFacetItemsGroup, FacetItemsGroup } from '@src/class/Facet';

const facetsAPI: APIFacetItemsGroup = {
	channel_type_id: { 24: 22 },
	country_path: { "0534": 100, "0103": 50 },
	language_id: { 127: 250 },
	media_id: { 11111: { name: "media 1", count: 20, url: "http://media1.com", type: "news" }, 22222: { name: "media 2", count: 100, url: "http://media2.com", type: "news" } }
};

const facetsGroups: FacetItemsGroup = {
	channel_type_id: [{ key: "24", counter: 22 }],
	country_path: [{ key: "0534", counter: 100 }, { key: "0103", counter: 50 }],
	language_id: [{ key: "127", counter: 250 }],
	media_id: [{ key: "22222", counter: 100, name: "media 2", detail: "http://media2.com", type: "news" }, { key: "11111", counter: 20, name: "media 1", detail: "http://media1.com", type: "news" }]
};

const facets: FacetObject = {
	groups: facetsGroups
};

const facetsGroupsOnlyChannel: FacetItemsGroup = {
	channel_type_id: [{ key: "24", counter: 22 }]
};

const facetsOnlyChannel: FacetObject = {
	groups: facetsGroupsOnlyChannel
};

const facetsAPIOnlyChannel: APIFacetItemsGroup = {
	channel_type_id: { 24: 22 }
};

const facetsAPIWithGroupingNeeeded: APIFacetItemsGroup = {
	channel_type_id: { 24: 22, 0: 10, 2: 30, 12: 25 }
};

const facetsGroupsWithGroupingNeeeded: FacetItemsGroup = {
	channel_type_id: [{ key: "online", counter: 40 }, { key: "blogs", counter: 25 }, { key: "24", counter: 22 }]
};

const facetsWithGroupingNeeeded: FacetObject = {
	groups: facetsGroupsWithGroupingNeeeded
};

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Facets reducer', () => {

	it('reset facets leaves state as is', () => {
		expect(reducers(
			getFullState({ search: { facets: { facetsGroupsOpened: ["group1"] } } }),
			operators.resetSearchFacetsData()
		))
			.toMatchObject({
				...INITIAL_STATE
			});
	});

	it('reducer toggle drawer to true', () => {
		expect(reducers(
			getFullState(),
			operators.toggleDrawer()
		).search.facets)
			.toMatchObject({
				drawerVisible: true
			});
	});

	it('reducer toggle drawer to false', () => {
		expect(reducers(
			getFullState({ search: { facets: { drawerVisible: true } } }),
			operators.toggleDrawer()
		).search.facets)
			.toMatchObject({
				drawerVisible: false
			});
	});

	it('reducer set facets groups opened', () => {
		expect(reducers(
			getFullState(),
			operators.setFacetsGroupsOpened({ facetsGroupsOpened: ["group1"] })
		).search.facets)
			.toMatchObject({
				facetsGroupsOpened: ["group1"]
			});
	});

	it('reducer set fetch api facets', () => {
		expect(reducers(
			getFullState(),
			operators.fetchAPIFacets()
		).search.facets)
			.toMatchObject({
				loadingFacets: true
			});
	});

	it('reducer set facets', () => {
		expect(reducers(
			getFullState(),
			operators.setFacets({ facets })
		).search.facets)
			.toMatchObject({
				loadingFacets: false,
				facets
			});
	});

	it('reducer set show more facet group key', () => {
		expect(reducers(
			getFullState(),
			operators.setShowMoreFacetGroupKey({ facetGroupKey: "channel_type_id" })
		).search.facets)
			.toMatchObject({
				showMoreFacetGroupKey: "channel_type_id",
				extended: EXTENDED_INITIAL_STATE
			});
	});

	it('reducer fetch group api facets', () => {
		expect(reducers(
			getFullState(),
			operators.fetchGroupAPIFacets({ groupKey: "channel_type_id" })
		).search.facets)
			.toMatchObject({
				loadingFacetsGroup: true
			});
	});

	it('reducer set facets error disables loading', () => {
		expect(reducers(
			getFullState({ search: { facets: { loadingFacets: true, loadingFacetsGroup: false } } }),
			operators.fetchFacetsError()
		).search.facets)
			.toMatchObject({
				loadingFacets: false,
				loadingFacetsGroup: false
			});
	});

	it('saga should set API facets', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.setFacets({ facets }))
			.dispatch(operators.setAPIFacets({ facetsAPI }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						facets
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set API facets with online and blogs group', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.setFacets({ facets: facetsWithGroupingNeeeded }))
			.dispatch(operators.setAPIFacets({ facetsAPI: facetsAPIWithGroupingNeeeded }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						facets: facetsWithGroupingNeeeded
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set group as opened', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.setFacetsGroupsOpened({ facetsGroupsOpened: ["group1"] }))
			.dispatch(operators.toggleFacetsGroupOpened({ groupKey: "group1" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						facetsGroupsOpened: ["group1"]
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set group as closed', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { facets: { facetsGroupsOpened: ["group1"] } } })) // withState always after withReducer
			.put(operators.setFacetsGroupsOpened({ facetsGroupsOpened: [] }))
			.dispatch(operators.toggleFacetsGroupOpened({ groupKey: "group1" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						facetsGroupsOpened: []
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set fetch a group facets API in article page', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				router: { location: { pathname: "/article" } },
				search: { facets: { facets: { groups: {} } } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { facets: facetsAPIOnlyChannel }]
			])
			.put(operators.setGroupAPIFacets({ facetsAPI: facetsAPIOnlyChannel, groupKey: "channel_type_id" }))
			.dispatch(operators.fetchGroupAPIFacets({ groupKey: "channel_type_id" }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				router: { location: { pathname: "/article" } },
				search: {
					facets: {
						facets: facetsOnlyChannel
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set fetch a group facets API in preview page', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: { facets: { facets: { groups: {} } } }
			})) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), { facets: facetsAPIOnlyChannel }]
			])
			.put(operators.setGroupAPIFacets({ facetsAPI: facetsAPIOnlyChannel, groupKey: "channel_type_id" }))
			.dispatch(operators.fetchGroupAPIFacets({ groupKey: "channel_type_id" }))
			.hasFinalState(getFullState({
				app: { profile: { user: { settings: { timezone: "Europe/Madrid" } } } },
				router: { location: { pathname: "/focus/focus-id/feed/create/socialmedia" } },
				search: {
					facets: {
						facets: facetsOnlyChannel
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set set group api facets', () => {
		const initialFacets: FacetObject = {
			groups: {
				channel_type_id: [{ key: "online", counter: 20 }, { key: "20", counter: 4 }],
				language_id: [{ key: "00", counter: 50 }, { key: "05", counter: 20 }]
			}
		};
		const finalFacets: FacetObject = {
			groups: {
				channel_type_id: [{ key: "online", counter: 20 }, { key: "20", counter: 4 }],
				language_id: [{ key: "20", counter: 40 }]
			}
		};
		const APILanguageFacets: APIFacetItemsGroup = {
			language_id: { 20: 40 }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				search: {
					facets: {
						facets: initialFacets
					}
				}
			})) // withState always after withReducer
			.put(operators.setFacets({ facets: finalFacets }))
			.dispatch(operators.setGroupAPIFacets({ facetsAPI: APILanguageFacets, groupKey: "language_id" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						facets: finalFacets
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set set group api media facets', () => {
		const initialFacets: FacetObject = {
			groups: {
				channel_type_id: [{ key: "online", counter: 20 }, { key: "20", counter: 4 }],
				language_id: [{ key: "00", counter: 50 }, { key: "05", counter: 20 }],
				media_id: [{ key: "11111", counter: 20, name: "media 1", detail: "http://media1.com", type: "news" }]
			}
		};
		const finalFacets: FacetObject = {
			groups: {
				channel_type_id: [{ key: "online", counter: 20 }, { key: "20", counter: 4 }],
				language_id: [{ key: "00", counter: 50 }, { key: "05", counter: 20 }],
				media_id: [
					{ key: "22222", counter: 100, name: "media 2", detail: "http://media2.com", type: "news" },
					{ key: "11111", counter: 20, name: "media 1", detail: "http://media1.com", type: "news" }
				]
			}
		};
		const APIMediaFacets: APIFacetItemsGroup = {
			media_id: { 11111: { name: "media 1", count: 20, url: "http://media1.com", type: "news" }, 22222: { name: "media 2", count: 100, url: "http://media2.com", type: "news" } }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				search: {
					facets: {
						facets: initialFacets
					}
				}
			})) // withState always after withReducer
			.put(operators.setFacets({ facets: finalFacets }))
			.dispatch(operators.setGroupAPIFacets({ facetsAPI: APIMediaFacets, groupKey: "media_id" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						facets: finalFacets
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set set channel group api facets', () => {
		const initialFacets: FacetObject = {
			groups: {
				channel_type_id: [{ key: "1", counter: 20 }, { key: "3", counter: 4 }],
				language_id: [{ key: "00", counter: 50 }, { key: "05", counter: 20 }]
			}
		};
		const finalFacets: FacetObject = {
			groups: {
				channel_type_id: [{ key: "blogs", counter: 50 }, { key: "online", counter: 20 }],
				language_id: [{ key: "00", counter: 50 }, { key: "05", counter: 20 }]
			}
		};
		const APILanguageFacets: APIFacetItemsGroup = {
			channel_type_id: { 0: 20, 12: 50 }
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				search: {
					facets: {
						facets: initialFacets
					}
				}
			})) // withState always after withReducer
			.put(operators.setFacets({ facets: finalFacets }))
			.dispatch(operators.setGroupAPIFacets({ facetsAPI: APILanguageFacets, groupKey: "channel_type_id" }))
			.hasFinalState(getFullState({
				search: {
					facets: {
						facets: finalFacets
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});
});
