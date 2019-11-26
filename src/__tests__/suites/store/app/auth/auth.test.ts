import merge from 'lodash/merge';
import { expectSaga } from 'redux-saga-test-plan';
import { call as callMatcher } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import server from '@src/lib/ajax/server';
import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/app/auth';
import { operators as profileOperators } from '@src/store/app/profile';
import { operators as notificationsOperators } from '@src/store/app/notifications';
import { State } from '@src/store/types';
import { Session } from '@src/types/session';
import { FacebookAuthStatus } from '@src/types/facebook';

const session: Session = {
	profile: {
		user: {
			id: "40BF1356-4E09-4065-8913-CFECDB7387A5",
			name: "Sergi Massaneda",
			role: "sysadmin",
			permissions: [
				"tenant_settings.edit",
				"feed.print.manage",
				"search.unrestricted_period",
				"feed.save.apply_to_past_results",
				"switch_tenant",
				"admin_access",
				"facebook_visible"
			],
			facebook_linked_ids: [
				"157193954975917"
			],
			settings: {
				language_code: "en",
				locale: "en-GB",
				results_page_size: 20,
				timezone: "UTC"
			}
		},
		tenant: {
			id: "rd-girona-test",
			guid: "00034972-0000-0000-0000-000000000000",
			name: "rd.girona.test",
			tier_properties: {
				name: "diamond",
				limit: 50000,
				results: {
					online: true,
					social: true
				}
			},
			print_only: false,
			facebook_linked_ids: [
				"157193954975917"
			],
			settings: {
				categorization_mode: "no_flc",
				currency: "USD",
				display_influencers: true,
				facebook_url: "https://www.facebook.com/conjunt.chapo",
				valuation_metric: "miv"
			}
		}
	},
	api: {
		token: "f29ddbce9b8900f5083d1af65ba2335e-LAwcEjPuL3On6R/vwZLr/wKtn",
		token_expires_at: "2019-02-04T17:20:55.256Z"
	},
	app: {
		skipFacebookLogin: false,
		version: "5ae0fe1"
	}
};

const facebookAuth: FacebookAuthStatus = {
	userID: "23493223",
	accessToken: "token",
	expiresIn: 2232323443,
	data_access_expiration_time: 2332342334,
	signedRequest: "sr"
};

const error = new Error();

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Auth store', () => {

	it('reducer fetch auth success', () => {
		expect(reducers(
			getFullState({ app: { auth: { authenticated: false } } }),
			operators.fetchAuthSuccess()
		).app.auth)
			.toMatchObject({ authenticated: true });
	});

	it('reducer fetch auth error', () => {
		expect(reducers(
			getFullState({ app: { auth: { authenticated: true } } }),
			operators.fetchAuthError({ error })
		).app.auth)
			.toMatchObject({ authenticated: false });
	});

	it('reducer fetch auth error', () => {
		expect(reducers(
			getFullState(),
			operators.setFacebookAuth({ facebookAuth })
		).app.auth)
			.toMatchObject({ facebookAuth });
	});

	it('saga should auth success, no facebook redirect', () => {
		const noRedirectSession = { ...session };
		noRedirectSession.app.skipFacebookLogin = true;
		noRedirectSession.profile.user.facebook_linked_ids = [];

		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[callMatcher.fn(server.getSession), noRedirectSession]
			])
			.not.call(server.redirectFacebookLogin)
			.put(operators.fetchAuthSuccess())
			.put(operators.setSession({ session: noRedirectSession }))
			.put(profileOperators.setProfile({ profile: noRedirectSession.profile }))
			.dispatch(operators.fetchAuth())
			.hasFinalState(getFullState({
				app: {
					profile: {
						user: noRedirectSession.profile.user,
						tenant: noRedirectSession.profile.tenant
					},
					auth: {
						authenticated: true
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should auth success, no facebook redirect skip', () => {
		const skipRedirectSession = { ...session };
		skipRedirectSession.app.skipFacebookLogin = true;
		skipRedirectSession.profile.user.facebook_linked_ids = [];

		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[callMatcher.fn(server.getSession), skipRedirectSession]
			])
			.not.call(server.redirectFacebookLogin)
			.put(operators.fetchAuthSuccess())
			.put(operators.setSession({ session: skipRedirectSession }))
			.put(profileOperators.setProfile({ profile: skipRedirectSession.profile }))
			.dispatch(operators.fetchAuth())
			.hasFinalState(getFullState({
				app: {
					profile: {
						user: skipRedirectSession.profile.user,
						tenant: skipRedirectSession.profile.tenant
					},
					auth: {
						authenticated: true
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should auth success, redirect facebook', () => {
		const redirectSession = { ...session };
		redirectSession.app.skipFacebookLogin = false;
		redirectSession.profile.user.facebook_linked_ids = [];

		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[callMatcher.fn(server.getSession), redirectSession],
				[callMatcher.fn(server.redirectFacebookLogin), null]
			])
			.call(server.redirectFacebookLogin)
			.put(operators.fetchAuthSuccess())
			.put(operators.setSession({ session: redirectSession }))
			.put(profileOperators.setProfile({ profile: redirectSession.profile }))
			.dispatch(operators.fetchAuth())
			.hasFinalState(getFullState({
				app: {
					profile: {
						user: redirectSession.profile.user,
						tenant: redirectSession.profile.tenant
					},
					auth: {
						authenticated: true
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should not auth with error', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[callMatcher.fn(server.getSession), throwError(error)]
			])
			.not.call(server.redirectFacebookLogin)
			.not.put(operators.fetchAuthSuccess())
			.not.put(operators.setSession({ session }))
			.not.put(profileOperators.setProfile({ profile: session.profile }))
			.put(operators.fetchAuthError({ error }))
			.dispatch(operators.fetchAuth())
			.hasFinalState(getFullState({
				app: {
					auth: {
						authenticated: false
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should fetch session success', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[callMatcher.fn(server.getSession), session]
			])
			.put(operators.fetchSessionSuccess())
			.put(operators.setSession({ session }))
			.put(profileOperators.setProfile({ profile: session.profile }))
			.dispatch(operators.fetchSession())
			.hasFinalState(getFullState({
				app: {
					profile: {
						user: session.profile.user,
						tenant: session.profile.tenant
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should not fetch session with error', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[callMatcher.fn(server.getSession), throwError(error)]
			])
			.not.call(server.redirectFacebookLogin)
			.not.put(operators.fetchSessionSuccess())
			.not.put(operators.setSession({ session }))
			.not.put(profileOperators.setProfile({ profile: session.profile }))
			.put(operators.fetchSessionError({ error }))
			.dispatch(operators.fetchSession())
			.hasFinalState(getFullState())
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should post facebook authStatus and not activated', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[callMatcher.fn(server.post), { updated: false, activated: false }]
			])
			.not.put(operators.fetchSession())
			.dispatch(operators.updateFacebookAuth({ authStatus: {} as FacebookAuthStatus }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga should not show notification on post facebook authStatus error', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[callMatcher.fn(server.post), throwError(error)],
				[callMatcher.fn(console.error), null]
			])
			.not.put(operators.fetchSession())
			.not.put.like({ action: { type: notificationsOperators.add.type } })
			.call.like({ fn: console.error })
			.dispatch(operators.updateFacebookAuth({ authStatus: {} as FacebookAuthStatus }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga should post facebook authStatus and activated', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[callMatcher.fn(server.post), { updated: true, activated: true }],
				[callMatcher.fn(server.getSession), session]
			])
			.put(operators.fetchSession())
			.put(operators.setSession({ session }))
			.put(profileOperators.setProfile({ profile: session.profile }))
			.dispatch(operators.updateFacebookAuth({ authStatus: {} as FacebookAuthStatus }))
			.hasFinalState(getFullState({
				app: {
					profile: {
						user: session.profile.user,
						tenant: session.profile.tenant
					}
				}
			}))
			.silentRun();
	});

	it('saga should check facebook auth', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[callMatcher.fn(server.post), {}]
			])
			.put(operators.setFacebookAuth({ facebookAuth }))
			.put(operators.fetchSession())
			.dispatch(operators.checkFacebookAuth({ authStatus: facebookAuth }))
			.hasFinalState(getFullState({ app: { auth: { facebookAuth } } }))
			.silentRun();
	});

	it('saga should check facebook auth on api error', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[callMatcher.fn(server.post), throwError(error)]
			])
			.put(operators.facebookAuthError({ error }))
			.not.put(operators.fetchSession())
			.dispatch(operators.checkFacebookAuth({ authStatus: facebookAuth }))
			.hasFinalState(getFullState())
			.silentRun();
	});

});
