import { expectSaga } from 'redux-saga-test-plan';
import merge from 'lodash/merge';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/search/filters';
import { operators as formOperators } from '@src/store/search/form';

import { State } from '@src/store/types';
import { State as FiltersState } from '@src/store/search/filters';
import { FiltersFacetGroup } from '@src/class/Filter';
import { FocusObject, FocusFeeds } from '@src/class/Focus';
import { FeedObject } from '@src/class/Feed';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

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
	type: "socialmedia",
};

const feedPrint: FeedObject = {
	...feedOnline,
	id: "feed-id-3",
	name: "feed-name-3",
	type: "print",
};

const focusFeeds: FocusFeeds = {
	online: [feedOnline],
	socialmedia: [feedSocial],
	print: [feedPrint]
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
};

const focusList: FocusObject[] = [focus];

const facetsGroups: FiltersFacetGroup = {
	channel_type_id: [{ key: "24" }],
	country_path: [{ key: "0534" }, { key: "0103" }],
	language_id: [{ key: "127" }]
};

const filters: FiltersState = {
	facetsGroups,
	focus: ["focus1"],
	feeds: ["feed1"]
};

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Filters reducer', () => {

	it('reducer set whole filters', () => {
		expect(reducers(
			getFullState(),
			operators.setFilters({ filters })
		).search.filters)
			.toMatchObject({
				...filters
			});
	});

	it('reducer set facet filters', () => {
		expect(reducers(
			getFullState(),
			operators.setFacetFilters({ facetsGroups })
		).search.filters)
			.toMatchObject({
				facetsGroups
			});
	});

	it('reducer set focus feeds filters', () => {
		expect(reducers(
			getFullState(),
			operators.setFilteredFocusFeeds({ focus: ["focusId1", "focusId2"], feeds: ["feedId1"] })
		).search.filters)
			.toMatchObject({
				focus: ["focusId1", "focusId2"],
				feeds: ["feedId1"]
			});
	});

	it('saga should add facet filter', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.setFacetFilters({ facetsGroups: { group1: [{ key: "value1" }] } }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFacetFilter({ facetGroupKey: "group1", facetFilter: { key: "value1" } }))
			.hasFinalState(getFullState({
				search: {
					filters: {
						facetsGroups: { group1: [{ key: "value1" }] }
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should add facet filter with group existing before', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { filters: { facetsGroups: { group1: [{ key: "value2" }] } } } })) // withState always after withReducer
			.put(operators.setFacetFilters({ facetsGroups: { group1: [{ key: "value2" }, { key: "value1" }] } }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFacetFilter({ facetGroupKey: "group1", facetFilter: { key: "value1" } }))
			.hasFinalState(getFullState({
				search: {
					filters: {
						facetsGroups: { group1: [{ key: "value2" }, { key: "value1" }] }
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove facet filter value', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { filters: { facetsGroups: { group1: [{ key: "value1" }, { key: "value2" }] } } } })) // withState always after withReducer
			.put(operators.setFacetFilters({ facetsGroups: { group1: [{ key: "value2" }] } }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFacetFilter({ facetGroupKey: "group1", facetFilter: { key: "value1" } }))
			.hasFinalState(getFullState({
				search: {
					filters: {
						facetsGroups: { group1: [{ key: "value2" }] }
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove last facet filter value', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { filters: { facetsGroups: { group1: [{ key: "value1" }] } } } })) // withState always after withReducer
			.put(operators.setFacetFilters({ facetsGroups: {} }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFacetFilter({ facetGroupKey: "group1", facetFilter: { key: "value1" } }))
			.hasFinalState(getFullState({
				search: {
					filters: {
						facetsGroups: {}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove a facet group', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { filters: { facetsGroups: { group1: ["value1"] } } } })) // withState always after withReducer
			.put(operators.setFacetFilters({ facetsGroups: {} }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.removeFacetFilterGroup({ facetGroupKey: "group1" }))
			.hasFinalState(getFullState({
				search: {
					filters: {
						facetsGroups: {}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should add a new filtered focus without filtered feeds', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [focus.id], feeds: [] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFilteredFocus({ focusId: focus.id }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [focus.id],
						feeds: []
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should add a new filtered focus with existing filtered feeds', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } }, search: { filters: { feeds: [feedOnline.id, feedSocial.id] } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [focus.id], feeds: [] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFilteredFocus({ focusId: focus.id }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [focus.id],
						feeds: []
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove a filtered focus', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } }, search: { filters: { focus: [focus.id] } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [], feeds: [] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFilteredFocus({ focusId: focus.id }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [],
						feeds: []
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should add a new feed filter', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [], feeds: [feedOnline.id] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFilteredFeed({ focusId: focus.id, feedId: feedOnline.id }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [],
						feeds: [feedOnline.id]
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should add a new feed filter making all feeds in focus to be filtered', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } }, search: { filters: { feeds: [feedSocial.id, feedPrint.id] } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [focus.id], feeds: [] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFilteredFeed({ focusId: focus.id, feedId: feedOnline.id }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [focus.id],
						feeds: []
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove feed filtered', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } }, search: { filters: { feeds: [feedOnline.id] } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [], feeds: [] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFilteredFeed({ focusId: focus.id, feedId: feedOnline.id }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [],
						feeds: []
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove a feed filtered when all feeds in focus are filtered too', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } }, search: { filters: { focus: [focus.id] } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [], feeds: [feedSocial.id, feedPrint.id] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.toggleFilteredFeed({ focusId: focus.id, feedId: feedOnline.id }))
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [],
						feeds: [feedSocial.id, feedPrint.id]
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove all focus and feeds filtered', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } }, search: { filters: { focus: [focus.id], feeds: ["fake-feed", "fake-feed-2"] } } })) // withState always after withReducer
			.put(operators.setFilteredFocusFeeds({ focus: [], feeds: [] }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.removeFocusFeedFilter())
			.hasFinalState(getFullState({
				focus: { list: { focusList } },
				search: {
					filters: {
						focus: [],
						feeds: []
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set group facets filters', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { filters: { facetsGroups: { channel_type_id: ["24"] } } } })) // withState always after withReducer
			.put(operators.setFacetFilters({ facetsGroups: { channel_type_id: [{ key: "online" }, { key: "blogs" }] } }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.setFacetGroupFilters({ groupKey: "channel_type_id", groupFacetsFiltered: [{ key: "online" }, { key: "blogs" }] }))
			.hasFinalState(getFullState({
				search: {
					filters: {
						facetsGroups: {
							channel_type_id: [{ key: "online" }, { key: "blogs" }]
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set group facets filters without values', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { filters: { facetsGroups: { channel_type_id: ["24"] } } } })) // withState always after withReducer
			.put(operators.setFacetFilters({ facetsGroups: {} }))
			.put(formOperators.setStart({ start: 0 }))
			.dispatch(operators.setFacetGroupFilters({ groupKey: "channel_type_id", groupFacetsFiltered: [] }))
			.hasFinalState(getFullState({
				search: {
					filters: {
						facetsGroups: {}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});
});
