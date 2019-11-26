import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';
import Api from '@src/lib/ajax/Api';
import server from '@src/lib/ajax/server';
import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/focus/list';
import { State } from '@src/store/types';
import { FocusObject, FocusFeeds } from '@src/class/Focus';
import { FeedObject } from '@src/class/Feed';
import { throwError } from 'redux-saga-test-plan/providers';
import { TenantUser } from '@src/class/Tenant';

import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const document = TestHelper.getDocument();

const feed: FeedObject = {
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

const feed2: FeedObject = {
	...feed,
	id: "feed-id-2",
	name: "feed-name-2",
	type: "socialmedia",
};

const feed3: FeedObject = {
	...feed,
	id: "feed-id-3",
	name: "feed-name-3",
	type: "print",
};

const feed4: FeedObject = {
	...feed,
	id: "feed-id-4",
	name: "feed-name-4",
	type: "print_percolator",
};

const focusFeeds: FocusFeeds = {
	online: [feed],
	socialmedia: [feed2],
	print: [feed3]
};

const tenantUser: TenantUser = {
	id: "user-id-1",
	email: "fake@fakemail.com",
	first_name: "Name",
	last_name: "Fake",
	inserted_at: new Date(),
	updated_at: new Date(),
	role: "manager"
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
	acl_users: [{
		user_id: tenantUser.id,
		first_name: tenantUser.first_name,
		last_name: tenantUser.last_name,
		discover_role: tenantUser.role
	}]
};

const focus2: FocusObject = {
	...focus,
	feeds: { online: [], socialmedia: [], print: [] },
	id: "focus-id-2",
	name: "focus-name-2",
	acl_users: []
};

const focusAPI: { entities: { feed: FeedObject[] } } = {
	...focus,
	entities: { feed: [feed, feed2, feed3] }
};

const focusList: FocusObject[] = [focus, focus2];

const error = new Error();

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Focus list store', () => {

	it('reducer fetch focus list', () => {
		expect(reducers(
			getFullState(),
			operators.fetchFocusList()
		).focus.list)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer fetch focus list success', () => {
		expect(reducers(
			getFullState(),
			operators.fetchFocusListSuccess({ focusList })
		).focus.list)
			.toMatchObject({
				loading: false,
				focusList
			});
	});

	it('reducer fetch focus list error', () => {
		expect(reducers(
			getFullState(),
			operators.fetchFocusListError({ error })
		).focus.list)
			.toMatchObject({
				loading: false,
				focusList: null
			});
	});

	it('reducer create focus', () => {
		expect(reducers(
			getFullState(),
			operators.createFocus({ name: focus.name })
		).focus.list)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer create focus success', () => {
		expect(reducers(
			getFullState(),
			operators.createFocusSuccess({ focusList })
		).focus.list)
			.toMatchObject({
				loading: false,
				focusList
			});
	});

	it('reducer create focus error', () => {
		expect(reducers(
			getFullState(),
			operators.createFocusError({ error })
		).focus.list)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer rename focus', () => {
		expect(reducers(
			getFullState(),
			operators.renameFocus({ focus, name: "name-renamed" })
		).focus.list)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer rename focus success', () => {
		expect(reducers(
			getFullState(),
			operators.renameFocusSuccess({ focusList })
		).focus.list)
			.toMatchObject({
				loading: false,
				focusList
			});
	});

	it('reducer rename focus error', () => {
		expect(reducers(
			getFullState(),
			operators.renameFocusError({ error })
		).focus.list)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer remove focus', () => {
		expect(reducers(
			getFullState(),
			operators.removeFocus({ focus })
		).focus.list)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer remove focus success', () => {
		expect(reducers(
			getFullState(),
			operators.removeFocusSuccess({ focusList })
		).focus.list)
			.toMatchObject({
				loading: false,
				focusList
			});
	});

	it('reducer remove focus error', () => {
		expect(reducers(
			getFullState(),
			operators.removeFocusError({ error })
		).focus.list)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer remove feed', () => {
		expect(reducers(
			getFullState(),
			operators.removeFeed({ focus, feed })
		).focus.list)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer remove feed success', () => {
		expect(reducers(
			getFullState(),
			operators.removeFocusSuccess({ focusList })
		).focus.list)
			.toMatchObject({
				loading: false,
				focusList
			});
	});

	it('reducer remove feed error', () => {
		expect(reducers(
			getFullState(),
			operators.removeFocusError({ error })
		).focus.list)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer update user focus allow access success', () => {
		expect(reducers(
			getFullState(),
			operators.updateFocusUserAllowAccessSuccess({ focusList })
		).focus.list)
			.toMatchObject({
				focusList
			});
	});

	it('reducer add manage focus user loading', () => {
		expect(reducers(
			getFullState(),
			operators.addManageFocusUserLoading({ userId: tenantUser.id })
		).focus.list)
			.toMatchObject({
				manageFocusLoadingUsers: [tenantUser.id]
			});
	});

	it('reducer remove manage focus user loading', () => {
		expect(reducers(
			getFullState({
				focus: {
					list: {
						manageFocusLoadingUsers: [tenantUser.id]
					}
				}
			}),
			operators.removeManageFocusUserLoading({ userId: tenantUser.id })
		).focus.list)
			.toMatchObject({
				manageFocusLoadingUsers: []
			});
	});

	it('saga should fetch focus list', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), [focusAPI]]
			])
			.put(operators.fetchFocusListSuccess({ focusList: [focus] }))
			.dispatch(operators.fetchFocusList())
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [focus] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should error on fetch focus list', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)]
			])
			.put(operators.fetchFocusListError({ error }))
			.dispatch(operators.fetchFocusList())
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga should create focus', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), focus2],
				[matchers.call.fn(server.redirectAsync), {}]
			])
			.put(operators.createFocusSuccess({ focusList: [focus2] }))
			.dispatch(operators.createFocus({ name: focus2.name }))
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [focus2] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should error on create focus', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.put(operators.createFocusError({ error }))
			.dispatch(operators.createFocus({ name: focus.name }))
			.hasFinalState(getFullState({ focus: { list: { focusList: [] } } }))
			.silentRun();
	});

	it('saga should rename focus', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.put), focus]
			])
			.put(operators.renameFocusSuccess({ focusList: [{ ...focus, name: focus2.name }] }))
			.dispatch(operators.renameFocus({ focus, name: focus2.name }))
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [{ ...focus, name: focus2.name }] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should error on rename focus', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.put), throwError(error)]
			])
			.put(operators.renameFocusError({ error }))
			.dispatch(operators.renameFocus({ focus, name: focus.name }))
			.hasFinalState(getFullState({ focus: { list: { focusList: [focus] } } }))
			.silentRun();
	});

	it('saga should remove focus', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), "OK"]
			])
			.put(operators.removeFocusSuccess({ focusList: [focus2] }))
			.dispatch(operators.removeFocus({ focus }))
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [focus2] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should error on remove focus', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), throwError(error)]
			])
			.put(operators.removeFocusError({ error }))
			.dispatch(operators.removeFocus({ focus }))
			.hasFinalState(getFullState({ focus: { list: { focusList: [focus] } } }))
			.silentRun();
	});

	it('saga should remove online feed', () => {
		const focusWithoutFeed: FocusObject = { ...focus, feeds: { ...focus.feeds!, online: [] } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), "OK"]
			])
			.put(operators.removeFeedSuccess({ focusList: [focusWithoutFeed] }))
			.dispatch(operators.removeFeed({ focus, feed }))
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [focusWithoutFeed] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove social feed', () => {
		const focusWithoutFeed: FocusObject = { ...focus, feeds: { ...focus.feeds!, socialmedia: [] } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), "OK"]
			])
			.put(operators.removeFeedSuccess({ focusList: [focusWithoutFeed] }))
			.dispatch(operators.removeFeed({ focus, feed: feed2 }))
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [focusWithoutFeed] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove print feed', () => {
		const focusWithoutFeed: FocusObject = { ...focus, feeds: { ...focus.feeds!, print: [] } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), "OK"]
			])
			.put(operators.removeFeedSuccess({ focusList: [focusWithoutFeed] }))
			.dispatch(operators.removeFeed({ focus, feed: feed3 }))
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [focusWithoutFeed] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should remove new print feed', () => {
		const focusWithoutFeed: FocusObject = { ...focus, feeds: { ...focus.feeds!, print: [] } };
		const focusWithNewPrintFeed = { ...focus, feeds: { ...focus.feeds!, print: [feed4] } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focusWithNewPrintFeed] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), "OK"]
			])
			.put(operators.removeFeedSuccess({ focusList: [focusWithoutFeed] }))
			.dispatch(operators.removeFeed({ focus: focusWithNewPrintFeed, feed: feed4 }))
			.hasFinalState(getFullState({
				focus: {
					list: { focusList: [focusWithoutFeed] }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should error on remove feed', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), throwError(error)]
			])
			.put(operators.removeFeedError({ error }))
			.dispatch(operators.removeFeed({ focus, feed }))
			.hasFinalState(getFullState({ focus: { list: { focusList: [focus] } } }))
			.silentRun();
	});

	it('saga should enable focus user allow access', () => {
		const focusWithACLUser: FocusObject = {
			...focus2,
			acl_users: [{
				user_id: tenantUser.id,
				first_name: tenantUser.first_name,
				last_name: tenantUser.last_name,
				discover_role: tenantUser.role
			}]
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus2] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), { created: "ok" }]
			])
			.put(operators.addManageFocusUserLoading({ userId: tenantUser.id }))
			.put(operators.removeManageFocusUserLoading({ userId: tenantUser.id }))
			.put(operators.updateFocusUserAllowAccessSuccess({ focusList: [focusWithACLUser] }))
			.dispatch(operators.updateFocusUserAllowAccess({ focusId: focus2.id, user: tenantUser, allow: true }))
			.hasFinalState(getFullState({ focus: { list: { focusList: [focusWithACLUser] } } }))
			.silentRun();
	});

	it('saga should disable focus user allow access', () => {
		const focusWithoutACLUser: FocusObject = {
			...focus,
			acl_users: []
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.delete), { removed: "ok" }]
			])
			.put(operators.addManageFocusUserLoading({ userId: tenantUser.id }))
			.put(operators.removeManageFocusUserLoading({ userId: tenantUser.id }))
			.put(operators.updateFocusUserAllowAccessSuccess({ focusList: [focusWithoutACLUser] }))
			.dispatch(operators.updateFocusUserAllowAccess({ focusId: focus.id, user: tenantUser, allow: false }))
			.hasFinalState(getFullState({ focus: { list: { focusList: [focusWithoutACLUser] } } }))
			.silentRun();
	});

	it('saga should error focus user allow access', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { list: { focusList: [focus2] } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.put(operators.addManageFocusUserLoading({ userId: tenantUser.id }))
			.put(operators.removeManageFocusUserLoading({ userId: tenantUser.id }))
			.put(operators.updateFocusUserAllowAccessError({ error }))
			.dispatch(operators.updateFocusUserAllowAccess({ focusId: focus2.id, user: tenantUser, allow: true }))
			.hasFinalState(getFullState({ focus: { list: { focusList: [focus2] } } }))
			.silentRun();
	});
});
