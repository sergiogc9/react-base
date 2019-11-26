import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';
import moment from 'moment';
import { throwError } from 'redux-saga-test-plan/providers';

import { ProfileObject } from '@src/class/Profile';
import { Settings as TenantSettings, TenantObject, TierProperties, TenantUser } from '@src/class/Tenant';
import { Settings as UserSettings, UserObject } from '@src/class/User';

import { setLanguage } from '@src/lib/i18n';
import * as formatter from '@src/lib/format';

import Api from '@src/lib/ajax/Api';
import server from '@src/lib/ajax/server';
import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/app/profile';
import { operators as searchOperators } from '@src/store/search/form/actions';
import { operators as resultsOperators } from '@src/store/search/results';
import { operators as focusFeedOperators } from '@src/store/focus/feed/';

import { State } from '@src/store/types';
import { FacebookAccount, InstagramAccount } from '@src/types/facebook';

const tierProperties: TierProperties = {
	name: "facekName",
	limit: 0,
	results: {
		online: true,
		social: true
	}
};

const tenantSettings: TenantSettings = {
	categorization_mode: 'all',
	currency: 'EUR',
	display_influencers: true,
	facebook_url: '',
	valuation_metric: 'miv'
};

const tenant: TenantObject = {
	id: "fakeId",
	guid: "fake-guid",
	name: "fakeName",
	tier_properties: tierProperties,
	settings: tenantSettings,
	print_only: true,
	facebook_linked_ids: []
};

const userSettings: UserSettings = {
	language_code: 'es',
	locale: 'en-US',
	results_page_size: 20,
	timezone: 'Europe/Madrid'
};

// TODO: Use user from test helper
const user: UserObject = {
	id: "fakeId",
	name: "fakeName",
	role: "fakeRole",
	permissions: [],
	facebook_linked_ids: [],
	settings: userSettings
};

const profile: ProfileObject = {
	tenant,
	user
};

const instagramAccount: InstagramAccount = {
	id: "instagram-id",
	facebook_page_id: "facebook-page-id",
	facebook_page_name: "facebook-page-name",
	name: "Instagram name",
	profile_picture_url: "http://fakeurl.com",
	screen_name: "insta-user"
};

const facebookAccount: FacebookAccount = {
	expires_at: new Date(),
	id: "facebook-account-id",
	insights_user_id: "userid",
	instagramAccounts: [instagramAccount],
	is_valid: true,
	name: "facebook name",
	picture_url: "http://fake.com/",
	scope: "",
	updated_at: new Date()
};

const facebookAccountWithoutInstagram = {
	...facebookAccount,
	instagramAccounts: []
};

const tenantUsers: TenantUser[] = [{
	id: "user-id-1",
	email: "fake@fakemail.com",
	first_name: "Name",
	last_name: "Fake",
	inserted_at: new Date(),
	updated_at: new Date(),
	role: "manager"
}];

const error = new Error();

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Profile reducer', () => {

	it('reducer set profile', () => {
		expect(reducers(
			getFullState(),
			operators.setProfile({ profile })
		).app.profile)
			.toMatchObject({
				tenant,
				user
			});
	});

	it('reducer set tenant', () => {
		expect(reducers(
			getFullState(),
			operators.setTenant({ tenant: profile.tenant })
		).app.profile)
			.toMatchObject({
				settings: {
					facebookImageUrl: "",
					loading: false,
					loadingFacebookImageUrl: false
				},
				tenant
			});
	});

	it('reducer set user', () => {
		expect(reducers(
			getFullState(),
			operators.setUser({ user: profile.user })
		).app.profile)
			.toMatchObject({
				user
			});
	});

	it('reducer update tenant settings', () => {
		expect(reducers(
			getFullState(),
			operators.updateTenantSettings({ tenantSettings })
		).app.profile.settings)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer update tenant settings success', () => {
		expect(reducers(
			getFullState(),
			operators.updateTenantSettingsSuccess()
		).app.profile.settings)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer update tenant settings error', () => {
		expect(reducers(
			getFullState(),
			operators.updateTenantSettingsError()
		).app.profile.settings)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer update user settings', () => {
		expect(reducers(
			getFullState(),
			operators.updateUserSettings({ userSettings })
		).app.profile.settings)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer update user settings success', () => {
		expect(reducers(
			getFullState(),
			operators.updateUserSettingsSuccess()
		).app.profile.settings)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer update user settings error', () => {
		expect(reducers(
			getFullState(),
			operators.updateUserSettingsError({ error: {} })
		).app.profile.settings)
			.toMatchObject({
				loading: false
			});
	});

	it('reducer fetch facebook image url', () => {
		expect(reducers(
			getFullState(),
			operators.fetchFacebookImageUrl({ url: "fake url" })
		).app.profile.settings)
			.toMatchObject({
				loadingFacebookImageUrl: true
			});
	});

	it('reducer fetch facebook image url success', () => {
		expect(reducers(
			getFullState(),
			operators.fetchFacebookImageUrlSuccess({ facebookImageUrl: "fake url" })
		).app.profile.settings)
			.toMatchObject({
				loadingFacebookImageUrl: false,
				facebookImageUrl: "fake url"
			});
	});

	it('reducer fetch facebook image url error', () => {
		expect(reducers(
			getFullState(),
			operators.fetchFacebookImageUrlError()
		).app.profile.settings)
			.toMatchObject({
				loadingFacebookImageUrl: false
			});
	});

	it('reducer fetch user facebook accounts', () => {
		expect(reducers(
			getFullState(),
			operators.fetchUserFacebookAccounts()
		).app.profile.settings)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer fetch user facebook accounts success', () => {
		expect(reducers(
			getFullState(),
			operators.fetchUserFacebookAccountsSuccess({ userFacebookAccounts: [facebookAccount] })
		).app.profile.settings)
			.toMatchObject({
				loading: false,
				userFacebookAccounts: [facebookAccount]
			});
	});

	it('reducer fetch user facebook accounts error', () => {
		expect(reducers(
			getFullState(),
			operators.fetchUserFacebookAccountsError({ error: {} })
		).app.profile.settings)
			.toMatchObject({
				loading: false,
				userFacebookAccounts: null
			});
	});

	it('reducer deauthorize user facebook accounts', () => {
		expect(reducers(
			getFullState({ app: { profile: { userFacebookAccounts: [facebookAccount] } } }),
			operators.deauthorizeFacebookAccount({ facebookAccount })
		).app.profile.settings)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer deauthorize user facebook accounts success', () => {
		expect(reducers(
			getFullState({ app: { profile: { userFacebookAccounts: [facebookAccount] } } }),
			operators.deauthorizeFacebookAccountSuccess({ userFacebookAccounts: [] })
		).app.profile.settings)
			.toMatchObject({
				loading: false,
				userFacebookAccounts: []
			});
	});

	it('reducer deauthorize user facebook accounts error', () => {
		expect(reducers(
			getFullState(),
			operators.deauthorizeFacebookAccountError({ error: {} })
		).app.profile.settings)
			.toMatchObject({
				loading: false,
				userFacebookAccounts: null
			});
	});

	it('reducer deauthorize user instagram account', () => {
		expect(reducers(
			getFullState({ app: { profile: { userFacebookAccounts: [facebookAccount] } } }),
			operators.deauthorizeInstagramAccount({ facebookAccount, instagramAccount })
		).app.profile.settings)
			.toMatchObject({
				loading: true
			});
	});

	it('reducer deauthorize user facebook accounts success', () => {
		expect(reducers(
			getFullState({ app: { profile: { userFacebookAccounts: [facebookAccount] } } }),
			operators.deauthorizeInstagramAccountSuccess({ userFacebookAccounts: [facebookAccountWithoutInstagram] })
		).app.profile.settings)
			.toMatchObject({
				loading: false,
				userFacebookAccounts: [facebookAccountWithoutInstagram]
			});
	});

	it('reducer deauthorize user facebook accounts error', () => {
		expect(reducers(
			getFullState(),
			operators.deauthorizeInstagramAccountError({ error: {} })
		).app.profile.settings)
			.toMatchObject({
				loading: false,
				userFacebookAccounts: null
			});
	});

	it('saga should set profile', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: null, user: null } } })) // withState always after withReducer
			.call(formatter.setSettings, profile.user.settings, profile.tenant.settings)
			.call(setLanguage, profile.user.settings.language_code)
			.dispatch(operators.setProfile({ profile }))
			.hasFinalState(getFullState({
				app: { profile }
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set user', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { user: null } } })) // withState always after withReducer
			.call(formatter.setUserSettings, profile.user.settings)
			.call(setLanguage, profile.user.settings.language_code)
			.dispatch(operators.setUser({ user: profile.user }))
			.hasFinalState(getFullState({
				app: {
					profile: {
						user: profile.user
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set tenant', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant: null } } })) // withState always after withReducer
			.call(formatter.setTenantSettings, profile.tenant.settings)
			.dispatch(operators.setTenant({ tenant: profile.tenant }))
			.hasFinalState(getFullState({
				app: {
					profile: {
						tenant: profile.tenant
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should update tenant settings', () => {
		const updatedTenant = { ...tenant, settings: { ...tenant.settings, facebook_url: 'https://facebook.com/fake' } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { ...profile, user: null } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(server.post), updatedTenant.settings]
			])
			.put(operators.updateTenantSettingsSuccess())
			.put(operators.setTenant({ tenant: updatedTenant }))
			.dispatch(operators.updateTenantSettings({ tenantSettings: updatedTenant.settings }))
			.hasFinalState(getFullState({
				app: {
					profile: { tenant: updatedTenant }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should update user settings', () => {
		const updatedUser = { ...user, settings: { ...user.settings, language: 'en' } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { ...profile, tenant: null } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(server.post), updatedUser.settings]
			])
			.not.put(resultsOperators.fetchSearch())
			.put(operators.updateUserSettingsSuccess())
			.put(operators.setUser({ user: updatedUser }))
			.dispatch(operators.updateUserSettings({ userSettings: updatedUser.settings }))
			.hasFinalState(getFullState({
				app: {
					profile: { user: updatedUser }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should update user settings with custom search dates changing timezone in articles', () => {
		const updatedUser = { ...user, settings: { ...user.settings, timezone: 'Asia/Tokyo' } };
		const searchBeginDate = moment.tz("2019015", "Europe/Madrid").startOf('day').toDate();
		const searchEndDate = moment.tz("2019020", "Europe/Madrid").endOf('day').toDate();
		const convertedBeginDate = moment.tz("2019015", "Asia/Tokyo").startOf('day').toDate();
		const convertedEndDate = moment.tz("2019020", "Asia/Tokyo").endOf('day').toDate();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { ...profile, tenant: null } },
				router: { location: { pathname: "/article" } },
				search: { form: { period: "custom", begin_date: searchBeginDate, end_date: searchEndDate } }
			}))
			.provide([
				[matchers.call.fn(server.post), updatedUser.settings]
			])
			.put(searchOperators.setPeriodAndDatesRange({ period: "custom", begin_date: convertedBeginDate, end_date: convertedEndDate }))
			.put(resultsOperators.fetchSearch())
			.put(operators.updateUserSettingsSuccess())
			.put(operators.setUser({ user: updatedUser }))
			.dispatch(operators.updateUserSettings({ userSettings: updatedUser.settings }))
			.hasFinalState(getFullState({
				app: {
					profile: { user: updatedUser }
				},
				router: { location: { pathname: "/article" } },
				search: {
					form: { period: "custom", begin_date: convertedBeginDate, end_date: convertedEndDate },
					results: { loadingDocuments: true }
				}
			}))
			.silentRun();
	});

	it('saga should update user settings with custom search dates changing in not articles nor preview page', () => {
		const updatedUser = { ...user, settings: { ...user.settings, timezone: 'Asia/Tokyo' } };
		const searchBeginDate = moment.tz("2019015", "Europe/Madrid").startOf('day').toDate();
		const searchEndDate = moment.tz("2019020", "Europe/Madrid").endOf('day').toDate();
		const convertedBeginDate = moment.tz("2019015", "Asia/Tokyo").startOf('day').toDate();
		const convertedEndDate = moment.tz("2019020", "Asia/Tokyo").endOf('day').toDate();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { ...profile, tenant: null } },
				router: { location: { pathname: "/focus" } },
				search: { form: { period: "custom", begin_date: searchBeginDate, end_date: searchEndDate } }
			}))
			.provide([
				[matchers.call.fn(server.post), updatedUser.settings]
			])
			.put(searchOperators.setPeriodAndDatesRange({ period: "custom", begin_date: convertedBeginDate, end_date: convertedEndDate }))
			.not.put(resultsOperators.fetchSearch())
			.put(operators.updateUserSettingsSuccess())
			.put(operators.setUser({ user: updatedUser }))
			.dispatch(operators.updateUserSettings({ userSettings: updatedUser.settings }))
			.hasFinalState(getFullState({
				app: {
					profile: { user: updatedUser }
				},
				router: { location: { pathname: "/focus" } },
				search: {
					form: { period: "custom", begin_date: convertedBeginDate, end_date: convertedEndDate }
				}
			}))
			.silentRun();
	});

	it('saga should update user settings without custom search dates changing timezone', () => {
		const updatedUser = { ...user, settings: { ...user.settings, timezone: 'Asia/Tokyo' } };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { ...profile, tenant: null } } }))
			.provide([
				[matchers.call.fn(server.post), updatedUser.settings]
			])
			.not.put(resultsOperators.fetchSearch())
			.put(operators.updateUserSettingsSuccess())
			.put(operators.setUser({ user: updatedUser }))
			.dispatch(operators.updateUserSettings({ userSettings: updatedUser.settings }))
			.hasFinalState(getFullState({
				app: {
					profile: { user: updatedUser }
				}
			}))
			.silentRun();
	});

	it('saga should fetch facebook url', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), 'fake url']
			])
			.put(operators.fetchFacebookImageUrlSuccess({ facebookImageUrl: "fake url" }))
			.dispatch(operators.fetchFacebookImageUrl({ url: "fake url" }))
			.hasFinalState(getFullState({
				app: {
					profile: {
						settings: {
							facebookImageUrl: "fake url"
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set url empty on facebook search', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), '']
			])
			.put(operators.fetchFacebookImageUrlSuccess({ facebookImageUrl: "" }))
			.dispatch(operators.fetchFacebookImageUrl({ url: "" }))
			.hasFinalState(getFullState({
				app: {
					profile: {
						settings: {
							facebookImageUrl: ""
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});
});

it('saga should fetch user facebook accounts', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState()) // withState always after withReducer
		.provide([
			[matchers.call.fn(server.get), [facebookAccount]]
		])
		.put(operators.fetchUserFacebookAccountsSuccess({ userFacebookAccounts: [facebookAccount] }))
		.dispatch(operators.fetchUserFacebookAccounts())
		.hasFinalState(getFullState({
			app: {
				profile: { settings: { userFacebookAccounts: [facebookAccount] } }
			}
		}))
		.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
});

it('saga should throw error when updating tenant settings', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState()) // withState always after withReducer
		.provide([
			[matchers.call.fn(server.post), throwError(error)]
		])
		.put(operators.updateTenantSettingsError())
		.dispatch(operators.updateTenantSettings({ tenantSettings: tenant.settings }))
		.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
});

it('saga should deauthorize user facebook account', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState({ app: { profile: { settings: { userFacebookAccounts: [facebookAccount] } } } })) // withState always after withReducer
		.provide([
			[matchers.call.fn(server.post), {}],
			[matchers.call.fn(Api.prototype.post), {}]
		])
		.not.put(focusFeedOperators.fetchInstagramAccounts())
		.put(operators.deauthorizeFacebookAccountSuccess({ userFacebookAccounts: [] }))
		.dispatch(operators.deauthorizeFacebookAccount({ facebookAccount }))
		.hasFinalState(getFullState({
			app: {
				profile: { settings: { userFacebookAccounts: [] } }
			}
		}))
		.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
});

it('saga should deauthorize user instagram account', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState({ app: { profile: { settings: { userFacebookAccounts: [facebookAccount] } } } })) // withState always after withReducer
		.provide([
			[matchers.call.fn(server.post), {}],
			[matchers.call.fn(Api.prototype.post), {}]
		])
		.not.put(focusFeedOperators.fetchInstagramAccounts())
		.put(operators.deauthorizeInstagramAccountSuccess({ userFacebookAccounts: [facebookAccountWithoutInstagram] }))
		.dispatch(operators.deauthorizeInstagramAccount({ facebookAccount, instagramAccount }))
		.hasFinalState(getFullState({
			app: {
				profile: { settings: { userFacebookAccounts: [facebookAccountWithoutInstagram] } }
			}
		}))
		.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
});

it('saga should deauthorize user facebook account with social instagram accounts loaded', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState({
			focus: { feed: { social: { instagramAccounts: [] } } },
			app: { profile: { settings: { userFacebookAccounts: [facebookAccount] } } }
		}))
		.provide([
			[matchers.call.fn(server.post), {}],
			[matchers.call.fn(Api.prototype.post), {}]
		])
		.put(focusFeedOperators.fetchInstagramAccounts())
		.put(operators.deauthorizeFacebookAccountSuccess({ userFacebookAccounts: [] }))
		.dispatch(operators.deauthorizeFacebookAccount({ facebookAccount }))
		.hasFinalState(getFullState({
			focus: { feed: { social: { instagramAccounts: [] } } },
			app: {
				profile: { settings: { userFacebookAccounts: [] } }
			}
		}))
		.silentRun();
});

it('saga should deauthorize user instagram account with social instagram accounts loaded', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState({
			focus: { feed: { social: { instagramAccounts: [] } } },
			app: { profile: { settings: { userFacebookAccounts: [facebookAccount] } } }
		}))
		.provide([
			[matchers.call.fn(server.post), {}],
			[matchers.call.fn(Api.prototype.post), {}]
		])
		.put(focusFeedOperators.fetchInstagramAccounts())
		.put(operators.deauthorizeInstagramAccountSuccess({ userFacebookAccounts: [facebookAccountWithoutInstagram] }))
		.dispatch(operators.deauthorizeInstagramAccount({ facebookAccount, instagramAccount }))
		.hasFinalState(getFullState({
			focus: { feed: { social: { instagramAccounts: [] } } },
			app: {
				profile: { settings: { userFacebookAccounts: [facebookAccountWithoutInstagram] } }
			}
		}))
		.silentRun();
});

it('saga should fetch tenant users', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState({ app: { profile: { tenant } } })) // withState always after withReducer
		.provide([
			[matchers.call.fn(Api.prototype.get), tenantUsers]
		])
		.put(operators.fetchTenantUsersSuccess({ tenantUsers }))
		.dispatch(operators.fetchTenantUsers())
		.hasFinalState(getFullState({
			app: {
				profile: { tenant: { ...tenant, users: tenantUsers } }
			}
		}))
		.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
});

it('saga should fetch tenant users error', () => {
	return expectSaga(sagas)
		.withReducer(reducers)
		.withState(getFullState({ app: { profile: { tenant } } })) // withState always after withReducer
		.provide([
			[matchers.call.fn(Api.prototype.get), throwError(error)]
		])
		.put(operators.fetchTenantUsersError({ error }))
		.dispatch(operators.fetchTenantUsers())
		.hasFinalState(getFullState({
			app: {
				profile: { tenant: { ...tenant, users: undefined } }
			}
		}))
		.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
});
