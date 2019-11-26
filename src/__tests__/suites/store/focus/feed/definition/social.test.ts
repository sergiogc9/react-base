import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';
import { throwError, dynamic } from 'redux-saga-test-plan/providers';
import moment from 'moment';

import server from '@src/lib/ajax/server';
import { reducers } from '@src/store';
import Api from '@src/lib/ajax/Api';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas, INITIAL_STATE as DEFINITION_SOCIAL_STATE } from '@src/store/focus/feed/definition/social';
import { operators as profileOperators } from '@src/store/app/profile';
import { State } from '@src/store/types';
import { SocialInstagramAccount, DefinitionSocialInstagramAccount, SocialExpression, ProfileExpressionsType, SocialProfileExpression } from '@src/class/Feed';
import { FacebookAccount, InstagramAccount, SearchFacebookPage, SearchInstagramAccount } from '@src/types/facebook';

const instagramAccount: InstagramAccount = {
	id: "id1",
	facebook_page_id: "facebook-page-id",
	facebook_page_name: "facebook-page-name",
	name: "Girona FC",
	profile_picture_url: "fakeurl.com",
	screen_name: "gironafc"
};

const socialInstagramAccount: SocialInstagramAccount = {
	id: "id1",
	name: "Girona FC",
	screen_name: "gironafc",
	profile_picture_url: "fakeurl.com",
	valid: true
};

const definitionInstagramAccount: DefinitionSocialInstagramAccount = {
	id: instagramAccount.id,
	screen_name: instagramAccount.screen_name,
	linkedExpression: { type: "include_expressions", index: 0 }
};

const facebookAccount: FacebookAccount = {
	expires_at: moment().add(1, 'day').toDate(),
	id: "facebook-account-id",
	insights_user_id: "userid",
	instagramAccounts: [instagramAccount],
	is_valid: true,
	name: "facebook name",
	picture_url: "http://fake.com/",
	scope: "",
	updated_at: new Date()
};

const searchInstagramAccount: SearchInstagramAccount = {
	id: "searchIg1",
	ig_id: "23i92234",
	name: "IG account",
	followers_count: 100,
	follows_count: 50,
	media_count: 10,
	username: "fakeuser",
	profile_picture_url: "fakeurl.com",
	biography: "bio",
	page: {
		id: "page1",
		name: "Facebook page",
		access_token: "token!",
		picture: { data: { url: "fakeurlpage.com" } }
	}
};

const facebookPage: SearchFacebookPage = {
	id: searchInstagramAccount.page.id,
	name: searchInstagramAccount.page.name,
	picture: searchInstagramAccount.page.picture.data.url,
	instagramAccounts: [searchInstagramAccount]
};

const socialInstagramAccounts: SocialInstagramAccount[] = [socialInstagramAccount];
const definitionInstagramAccounts: DefinitionSocialInstagramAccount[] = [definitionInstagramAccount];
const facebookAccounts: FacebookAccount[] = [facebookAccount];

const includeExpression: SocialExpression = { enabled: true, q: "random", scope: ["mentions"] };
const mainDefinitionInstagramAccount: DefinitionSocialInstagramAccount = { ...definitionInstagramAccount, linkedExpression: { type: "main", index: 0 } };

const profileExpression: SocialProfileExpression = {
	api_version: 'v1',
	channel_type_id: 0,
	enabled: true,
	id: 'id1',
	name: 'profileName',
	picture: 'fakeurljpg.com',
	screen_name: 'username',
	url: 'fakeurl.com'
};

const profileExpressionTypes: ProfileExpressionsType[] = ["include_profiles", "exclude_profiles"];

const error = new Error();

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Focus feed definition social store', () => {

	it('reducer change main query', () => {
		expect(reducers(
			getFullState(),
			operators.changeMainQuery({ q: 'kketa' })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						main: {
							q: 'kketa',
							enabled: true,
							scope: ["title", "content", "instagram.users_in_photo"]
						}
					}
				}
			});
	});

	it('reducer change main enable', () => {
		expect(reducers(
			getFullState(),
			operators.toggleEnableMainQuery({ enabled: false })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						main: {
							q: '',
							enabled: false,
							scope: ["title", "content", "instagram.users_in_photo"]
						}
					}
				}
			});
	});

	it('reducer change main scope', () => {
		expect(reducers(
			getFullState(),
			operators.changeMainScope({ scope: ['mentions'] })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						main: {
							q: '',
							enabled: true,
							scope: ['mentions']
						}
					}
				}
			});
	});

	it('reducer set main expression error to true', () => {
		expect(reducers(
			getFullState(),
			operators.setMainExpressionError({ hasError: true })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						main: {
							error: true
						}
					}
				}
			});
	});

	it('reducer set main expression error to false', () => {
		expect(reducers(
			getFullState(),
			operators.setMainExpressionError({ hasError: false })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						main: {
							error: undefined
						}
					}
				}
			});
	});

	it('reducer change query', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }, { q: 'kketa', enabled: false, scope: ['mentions'] }] } } } } }),
			operators.changeQuery({ q: 'kketa', type: 'include_expressions', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [
							{
								q: 'kketa',
								enabled: true,
								scope: ['tags']
							},
							{ q: 'kketa', enabled: false, scope: ['mentions'] }
						]
					}
				}
			});
	});

	it('reducer change enable', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }, { q: 'kketa', enabled: false, scope: ['mentions'] }] } } } } }),
			operators.toggleEnableQuery({ enabled: false, type: 'include_expressions', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [
							{
								q: '',
								enabled: false,
								scope: ['tags']
							},
							{ q: 'kketa', enabled: false, scope: ['mentions'] }]
					}
				}
			});
	});

	it('reducer change scope', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }, { q: 'kketa', enabled: false, scope: ['mentions'] }] } } } } }),
			operators.changeScope({ scope: ['mentions'], type: 'include_expressions', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [
							{
								q: '',
								enabled: true,
								scope: ['mentions']
							},
							{ q: 'kketa', enabled: false, scope: ['mentions'] }]
					}
				}
			});
	});

	it('reducer set expression error to true', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }, { q: 'kketa', enabled: false, scope: ['mentions'] }] } } } } }),
			operators.setExpressionError({ hasError: true, type: 'include_expressions', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [
							{
								error: true
							},
							{ q: 'kketa', enabled: false, scope: ['mentions'] }
						]
					}
				}
			});
	});

	it('reducer set expression error to false', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }, { q: 'kketa', enabled: false, scope: ['mentions'] }] } } } } }),
			operators.setExpressionError({ hasError: false, type: 'include_expressions', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [
							{
								error: undefined
							},
							{ q: 'kketa', enabled: false, scope: ['mentions'] }
						]
					}
				}
			});
	});

	it('reducer add inclusive expression', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }] } } } } }),
			operators.addExpression({ type: 'include_expressions' })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [
							{
								q: '',
								enabled: true,
								scope: ['tags']
							},
							{ q: '', enabled: true, scope: ["title", "content", "instagram.users_in_photo"] }]
					}
				}
			});
	});

	it('reducer add exclusive expression', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }] } } } } }),
			operators.addExpression({ type: 'exclude_expressions' })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [
							{
								q: '',
								enabled: true,
								scope: ['tags']
							}
						],
						exclude_expressions: [
							{ q: '', enabled: true, scope: ["title", "content", "instagram.users_in_photo"] }
						]
					}
				}
			});
	});

	it('reducer remove expression', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_expressions: [{ q: '', enabled: true, scope: ['tags'] }] } } } } }),
			operators.removeExpression({ type: 'include_expressions', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_expressions: [],
						exclude_expressions: []
					}
				}
			});
	});

	profileExpressionTypes.forEach(type => {
		it('reducer remove profile expression: ' + type, () => {
			expect(reducers(
				getFullState({ focus: { feed: { social: { definition: { [type]: [profileExpression] } } } } }),
				operators.removeProfileExpression({ type, index: 0 })
			).focus.feed)
				.toMatchObject({
					social: {
						definition: {
							include_profiles: [],
							exclude_profiles: []
						}
					}
				});
		});
	});

	profileExpressionTypes.forEach(type => {
		it('reducer add social profile expression: ' + type, () => {
			expect(reducers(
				getFullState(),
				operators.addProfileExpression({ type })
			).focus.feed)
				.toMatchObject({
					social: {
						definition: {
							[type]: [
								{
									api_version: '',
									channel_type_id: 0,
									enabled: true,
									id: '',
									name: '',
									picture: '',
									screen_name: '',
									url: ''
								}
							]
						}
					}
				});
		});
	});

	it('reducer search profile', () => {
		expect(reducers(
			getFullState(),
			operators.searchProfile({ url: "https://fakeurl", type: 'include_profiles', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					loadingProfiles: {
						include_profiles: [true]
					}
				}
			});
	});

	it('reducer fetch instagram account success', () => {
		expect(reducers(
			getFullState(),
			operators.fetchInstagramAccountsSuccess({ instagramAccounts: socialInstagramAccounts })
		).focus.feed)
			.toMatchObject({
				social: {
					instagramAccounts: socialInstagramAccounts

				}
			});
	});

	it('reducer search profile success', () => {
		expect(reducers(
			getFullState(),
			operators.searchProfileSuccess({ profile: { url: "https://fakeurl" }, type: 'include_profiles', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_profiles: [{
							url: "https://fakeurl",
							enabled: true
						}]
					},
					loadingProfiles: {
						include_profiles: [false]
					}
				}
			});
	});

	it('reducer change query profile', () => {
		expect(reducers(
			getFullState({ focus: { feed: { social: { definition: { include_profiles: [{ url: '', enabled: true }] } } } } }),
			operators.changeQueryProfile({ url: 'kketa', type: 'include_profiles', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: {
						include_profiles: [
							{
								url: 'kketa',
								enabled: true
							}
						]
					}
				}
			});
	});

	it('reducer search profile error', () => {
		expect(reducers(
			getFullState(),
			operators.searchProfileError({ error: {}, type: 'include_profiles', index: 0 })
		).focus.feed)
			.toMatchObject({
				social: {
					loadingProfiles: {
						include_profiles: [false]
					}
				}
			});
	});

	it('reducer set threshold', () => {
		const threshold = {
			value: 10,
			enabled: true
		};
		return expect(reducers(
			getFullState(),
			operators.setThreshold({ threshold, channel: 40 })
		).focus.feed).toMatchObject({
			social: {
				definition: {
					threshold: {
						40: {
							value: 10,
							enabled: true
						}
					}
				}
			}
		});
	});

	it('reducer set dialog facebook user id', () => {
		return expect(reducers(
			getFullState(),
			operators.setDialogFacebookUserId({ facebookUserId: "1234" })
		).focus.feed).toMatchObject({
			social: {
				facebookDialog: {
					facebookUserId: "1234"
				}
			}
		});
	});

	it('reducer set dialog accounts', () => {
		return expect(reducers(
			getFullState(),
			operators.setDialogAccounts({ instagramAccounts: [instagramAccount], facebookPages: [facebookPage], selectedAccounts: [instagramAccount.id] })
		).focus.feed).toMatchObject({
			social: {
				facebookDialog: {
					instagramAccounts: [instagramAccount],
					facebookPages: [facebookPage],
					selectedAccounts: [instagramAccount.id]
				}
			}
		});
	});

	it('reducer fetch dialog accounts error', () => {
		return expect(reducers(
			getFullState({ focus: { feed: { social: { facebookDialog: { facebookUserId: "12", instagramAccounts: [instagramAccount], facebookPages: [facebookPage] } } } } }),
			operators.fetchDialogAccountsError({ error })
		).focus.feed).toMatchObject({
			social: {
				facebookDialog: {
					facebookUserId: null,
					instagramAccounts: null,
					facebookPages: null
				}
			}
		});
	});

	it('reducer reset dialog data', () => {
		return expect(reducers(
			getFullState({
				focus: { feed: { social: { facebookDialog: { facebookUserId: "12", instagramAccounts: [instagramAccount], facebookPages: [facebookPage], selectedAccounts: ["323"] } } } }
			}),
			operators.resetDialogData()
		).focus.feed).toMatchObject({
			social: {
				facebookDialog: {
					facebookUserId: null,
					instagramAccounts: null,
					facebookPages: null,
					selectedAccounts: []
				}
			}
		});
	});

	it('reducer toggle dialog selected account', () => {
		return expect(reducers(
			getFullState({ focus: { feed: { social: { facebookDialog: { selectedAccounts: ["1", "2", "3"] } } } } }),
			operators.toggleDialogSelectedAccount({ accountId: "2" })
		).focus.feed).toMatchObject({
			social: {
				facebookDialog: {
					selectedAccounts: ["1", "3"]
				}
			}
		});
	});

	it(`saga should search profile success`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { profile: { url: 'https://fakeurl.com' } }]
			])
			.put(operators.searchProfileSuccess({ profile: { url: 'https://fakeurl.com', api_version: 'new' }, type: 'include_profiles', index: 0 }))
			.dispatch(operators.searchProfile({ url: 'https://fakeurl.com', type: 'include_profiles', index: 0 }))
			.hasFinalState(getFullState({
				focus: {
					feed: {
						social: {
							definition: {
								include_profiles: [{
									url: "https://fakeurl.com",
									enabled: true,
									error: undefined,
									api_version: 'new'
								}]
							},
							loadingProfiles: {
								include_profiles: [false]
							}
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should search profile already exists success`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { include_profiles: [{ url: '', enabled: true }] } } } } })) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { profile: { url: 'https://fakeurl.com' } }]
			])
			.put(operators.searchProfileSuccess({ profile: { url: 'https://fakeurl.com', api_version: 'new' }, type: 'include_profiles', index: 0 }))
			.dispatch(operators.searchProfile({ url: 'https://fakeurl.com', type: 'include_profiles', index: 0 }))
			.hasFinalState(getFullState({
				focus: {
					feed: {
						social: {
							definition: {
								include_profiles: [{
									url: "https://fakeurl.com",
									enabled: true,
									error: undefined,
									api_version: 'new'
								}]
							},
							loadingProfiles: {
								include_profiles: [false]
							}
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should search profile success with error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { error: 'unknown profile' }]
			])
			.put(operators.searchProfileError({ error: 'unknown profile', type: 'include_profiles', index: 0 }))
			.dispatch(operators.searchProfile({ url: 'https://fakeurl.com', type: 'include_profiles', index: 0 }))
			.hasFinalState(getFullState({
				focus: {
					feed: {
						social: {
							definition: {
								include_profiles: [{
									error: true
								}]
							},
							loadingProfiles: {
								include_profiles: [false]
							}
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should search profile error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)]
			])
			.put(operators.searchProfileError({ error, type: 'include_profiles', index: 0 }))
			.dispatch(operators.searchProfile({ url: 'https://fakeurl.com', type: 'include_profiles', index: 0 }))
			.hasFinalState(getFullState({
				focus: {
					feed: {
						social: {
							definition: {
								include_profiles: [{
									error: true
								}]
							},
							loadingProfiles: {
								include_profiles: [false]
							}
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga should search profile error without error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), { error: '' }]
			])
			.put(operators.searchProfileError({ error: '', type: 'include_profiles', index: 0 }))
			.dispatch(operators.searchProfile({ url: 'https://fakeurl.com', type: 'include_profiles', index: 0 }))
			.hasFinalState(getFullState({
				focus: {
					feed: {
						social: {
							definition: {
								include_profiles: [{
									error: undefined
								}]
							},
							loadingProfiles: {
								include_profiles: [false]
							}
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it(`saga shouldn't search profile because url error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { include_profiles: [{ url: '', enabled: true }] } } } } })) // withState always after withReducer
			.put(operators.setExpressionError({ hasError: true, type: 'include_profiles', index: 0 }))
			.dispatch(operators.searchProfile({ url: 'https://fakeurl', type: 'include_profiles', index: 0 }))
			.hasFinalState(getFullState({
				focus: {
					feed: {
						social: {
							definition: {
								include_profiles: [{ url: '', enabled: true, error: true }]
							},
							loadingProfiles: {
								include_profiles: [false]
							}
						}
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('reducer set definition instagram accounts', () => {
		expect(reducers(
			getFullState(),
			operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts })
		).focus.feed)
			.toMatchObject({
				social: {
					definition: { instagram_accounts: definitionInstagramAccounts }
				}
			});
	});

	const fetchInstagramTests = [
		{
			text: "saga should fetch instagram accounts",
			apiResponse: facebookAccounts,
			resultingSocialInstagramAccounts: socialInstagramAccounts
		},
		{
			text: "saga should fetch instagram accounts with duplicated instagram account",
			apiResponse: [{ ...facebookAccount, is_valid: false }, facebookAccount],
			resultingSocialInstagramAccounts: socialInstagramAccounts
		},
		{
			text: "saga should fetch instagram accounts",
			apiResponse: [{ ...facebookAccount, is_valid: false }, { ...facebookAccount, is_valid: false }],
			resultingSocialInstagramAccounts: [{ ...socialInstagramAccount, valid: false }]
		}
	];

	for (const test of fetchInstagramTests) {
		it(test.text, () => {
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState())
				.provide([
					[matchers.call.fn(server.get), test.apiResponse]
				])
				.put(operators.fetchInstagramAccountsSuccess({ instagramAccounts: test.resultingSocialInstagramAccounts }))
				.put(profileOperators.fetchUserFacebookAccounts())
				.dispatch(operators.fetchInstagramAccounts())
				.hasFinalState(getFullState({
					app: { profile: { settings: { loading: true } } },
					focus: { feed: { social: { instagramAccounts: test.resultingSocialInstagramAccounts } } }
				}))
				.silentRun();
		});
	}

	it(`saga should fetch instagram accounts api error`, () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(server.get), throwError(error)]
			])
			.put(operators.fetchInstagramAccountsError({ error }))
			.dispatch(operators.fetchInstagramAccounts())
			.hasFinalState(getFullState({
				focus: { feed: { social: { instagramAccounts: null } } }
			}))
			.silentRun();
	});

	it("saga should toggle definition instagram account in main expression", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [mainDefinitionInstagramAccount] }))
			.put(operators.changeMainQuery({ q: definitionInstagramAccount.screen_name }))
			.dispatch(operators.toggleDefinitionInstagramAccount({ account: mainDefinitionInstagramAccount }))
			.hasFinalState(getFullState({
				focus: { feed: { social: { definition: { main: { q: mainDefinitionInstagramAccount.screen_name }, instagram_accounts: [mainDefinitionInstagramAccount] } } } }
			}))
			.silentRun();
	});

	it("saga should toggle definition instagram account in include expression", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { include_expressions: [includeExpression] } } } } }))
			.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [definitionInstagramAccount] }))
			.put(operators.changeQuery({ q: definitionInstagramAccount.screen_name, index: definitionInstagramAccount.linkedExpression.index, type: "include_expressions" }))
			.dispatch(operators.toggleDefinitionInstagramAccount({ account: definitionInstagramAccount }))
			.hasFinalState(getFullState({
				focus: {
					feed: { social: { definition: { include_expressions: [{ ...includeExpression, q: definitionInstagramAccount.screen_name }], instagram_accounts: [definitionInstagramAccount] } } }
				}
			}))
			.silentRun();
	});

	it("saga should toggle removing definition instagram account", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { include_expressions: [includeExpression], instagram_accounts: [definitionInstagramAccount] } } } } }))
			.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [] }))
			.not.put(operators.changeQuery({ q: definitionInstagramAccount.screen_name, index: definitionInstagramAccount.linkedExpression.index, type: "include_expressions" }))
			.dispatch(operators.toggleDefinitionInstagramAccount({ account: definitionInstagramAccount }))
			.hasFinalState(getFullState({
				focus: { feed: { social: { definition: { include_expressions: [includeExpression], instagram_accounts: [] } } } }
			}))
			.silentRun();
	});

	it("saga should change main scope with instagram account linked", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { main: { q: "random", scope: ["mentions"] }, instagram_accounts: [mainDefinitionInstagramAccount] } } } } }))
			.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [] }))
			.dispatch(operators.changeMainScope({ scope: ["title", "content", "instagram.users_in_photo"] }))
			.hasFinalState(getFullState({
				focus: { feed: { social: { definition: { main: { q: "", scope: ["title", "content", "instagram.users_in_photo"] }, instagram_accounts: [] } } } }
			}))
			.silentRun();
	});

	it("saga should change scope with instagram account linked", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { include_expressions: [includeExpression], instagram_accounts: [definitionInstagramAccount] } } } } }))
			.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [] }))
			.dispatch(operators.changeScope({ scope: ["tags"], index: definitionInstagramAccount.linkedExpression.index, type: "include_expressions" }))
			.hasFinalState(getFullState({
				focus: { feed: { social: { definition: { include_expressions: [{ q: "", scope: ["tags"], enabled: true }], instagram_accounts: [] } } } }
			}))
			.silentRun();
	});

	it("saga should change main scope without instagram account linked", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { main: { q: "random", scope: ["mentions"] }, instagram_accounts: [definitionInstagramAccount] } } } } }))
			.not.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [] }))
			.dispatch(operators.changeMainScope({ scope: ["title", "content", "instagram.users_in_photo"] }))
			.hasFinalState(getFullState({
				focus: { feed: { social: { definition: { main: { q: "random", scope: ["title", "content", "instagram.users_in_photo"] }, instagram_accounts: [definitionInstagramAccount] } } } }
			}))
			.silentRun();
	});

	it("saga should change main scope in exclude expression", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { exclude_expressions: [includeExpression], instagram_accounts: [definitionInstagramAccount] } } } } }))
			.not.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [] }))
			.dispatch(operators.changeScope({ scope: ["tags"], index: definitionInstagramAccount.linkedExpression.index, type: "exclude_expressions" }))
			.hasFinalState(getFullState({
				focus: { feed: { social: { definition: { exclude_expressions: [{ ...includeExpression, scope: ["tags"] }], instagram_accounts: [definitionInstagramAccount] } } } }
			}))
			.silentRun();
	});

	it("saga should remove expression with linked instagram", () => {
		const otherDefinitionInstagramAccounts: DefinitionSocialInstagramAccount = {
			...definitionInstagramAccount,
			screen_name: "not_removed",
			linkedExpression: { type: "include_expressions", index: 1 }
		};
		const multipleDefinitionInstagramAccounts: DefinitionSocialInstagramAccount[] = [definitionInstagramAccount, otherDefinitionInstagramAccounts];
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { definition: { instagram_accounts: multipleDefinitionInstagramAccounts } } } } }))
			.put(operators.setDefinitionInstagramAccounts({ definitionInstagramAccounts: [{ ...otherDefinitionInstagramAccounts, linkedExpression: { type: "include_expressions", index: 0 } }] }))
			.dispatch(operators.removeExpression({ type: "include_expressions", index: 0 }))
			.hasFinalState(getFullState({
				focus: {
					feed: { social: { definition: { instagram_accounts: [{ ...otherDefinitionInstagramAccounts, linkedExpression: { type: "include_expressions", index: 0 } }] } } }
				}
			}))
			.silentRun();
	});

	it("saga should set dialog facebook user id", () => {
		const apiGetMock = ({ args }: any) => {
			const path = args[0];
			if (path.match(/\/searchAccounts/)) return [searchInstagramAccount, { ...searchInstagramAccount, id: "idInFacebook" }];
			else return { ...facebookAccount, instagramAccounts: [...facebookAccount.instagramAccounts, { ...instagramAccount, id: "idInFacebook" }] };
		};
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(server.get), dynamic(apiGetMock)]
			])
			.put(operators.setDialogAccounts({
				instagramAccounts: [instagramAccount, { ...instagramAccount, id: "idInFacebook" }],
				facebookPages: [{ ...facebookPage, instagramAccounts: [...facebookPage.instagramAccounts, { ...searchInstagramAccount, id: "idInFacebook" }] }],
				selectedAccounts: [searchInstagramAccount.id]
			}))
			.dispatch(operators.setDialogFacebookUserId({ facebookUserId: "1234" }))
			.hasFinalState(getFullState({
				focus: {
					feed: {
						social: {
							facebookDialog: {
								facebookUserId: "1234",
								instagramAccounts: [instagramAccount, { ...instagramAccount, id: "idInFacebook" }],
								facebookPages: [{ ...facebookPage, instagramAccounts: [...facebookPage.instagramAccounts, { ...searchInstagramAccount, id: "idInFacebook" }] }],
								selectedAccounts: [searchInstagramAccount.id]
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it("saga should set dialog facebook user id with api call error", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(server.get), throwError(error)]
			])
			.put(operators.fetchDialogAccountsError({ error }))
			.dispatch(operators.setDialogFacebookUserId({ facebookUserId: "1234" }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it("saga should authorize dialog selected accounts", () => {
		const initialDialogState = { facebookUserId: "1234", selectedAccounts: [facebookPage.instagramAccounts[0].id], facebookPages: [facebookPage] };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { facebookDialog: initialDialogState } } } }))
			.provide([
				[matchers.call.fn(Api.prototype.post), { ok: true }]
			])
			.put(operators.fetchInstagramAccounts())
			.dispatch(operators.authorizeDialogSelectedAccounts())
			.hasFinalState(getFullState({ focus: { feed: { social: { facebookDialog: initialDialogState } } } }))
			.silentRun();
	});

	it("saga should authorize dialog selected accounts api error", () => {
		const initialDialogState = { facebookUserId: "1234", selectedAccounts: [facebookPage.instagramAccounts[0].id], facebookPages: [facebookPage] };
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ focus: { feed: { social: { facebookDialog: initialDialogState } } } }))
			.provide([
				[matchers.call.fn(Api.prototype.post), throwError(error)]
			])
			.put(operators.authorizeDialogSelectedAccountsError({ error }))
			.dispatch(operators.authorizeDialogSelectedAccounts())
			.hasFinalState(getFullState({ focus: { feed: { social: { facebookDialog: initialDialogState } } } }))
			.silentRun();
	});
});
