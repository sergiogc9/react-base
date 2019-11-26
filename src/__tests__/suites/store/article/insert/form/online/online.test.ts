import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import merge from 'lodash/merge';
import union from 'lodash/union';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/article/insert/form/online';
import { State } from '@src/store/types';
import i18n from '@src/lib/i18n';
import { INITIAL_STATE as ONLINE_INITIAL_STATE } from '@src/store/article/insert/form/online';
import Api from '@src/lib/ajax/Api';
import { MediaOption } from '@src/types/article/insert';
import { ApiMediaObj } from '@src/types/medias/medias';

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

const date = new Date();
const error = new Error('SOME_ERROR');

const medias: MediaOption[] = [
	{
		id: "123456",
		name: "Media 1",
		url: "fake url"
	},
	{
		id: "7891",
		name: "Media 2",
		url: "fake url"
	},
];

const availableMediasResponse = {
	medias,
	numFound: 2
};

const mediaInfoResponse: ApiMediaObj = {
	agency_id: null,
	average_daily_saved_articles: 66.8667,
	description: "",
	generic_email: "redaccion@3djuegos.com",
	id: 1133177530,
	inserted_at: "2005-11-28T11:32:10Z",
	is_in_google_news: "YES",
	language: {
		code: "es",
		id: 0,
		name: "spanish"
	},
	location: {
		continent: {
			id: "01",
			name: "Europe"
		},
		country: {
			code: "ES",
			id: "0100",
			name: "Spain"
		},
		region: {
			id: "010011",
			name: "Aragon"
		},
		subregion: {
			id: "01001103",
			name: "Zaragoza"
		}
	},
	modified_at: "2019-07-12T12:44:48Z",
	origin: "imente",
	rank: {
		advertising_value: "11485",
		alexa_inlinks: 1283,
		alexa_inlinks_host_match: 1,
		alexa_page_views: 2.39,
		alexa_rank: 3441,
		alexa_reach: 243,
		audience: "961081",
		audience_mode: "ALEXA_REACH",
		google_inlinks: 28,
		google_pagerank: 5,
		miv: {
			DISCOVER_VALUE: 5116.35805374881,
			VALUE: 5116.35805374881
		},
		similarweb_applied_correcion: "none",
		similarweb_monthly_visits: "22543190",
		similarweb_updated_at: "2019-07-11 01:32:51",
		source_rank: 66882
	},
	searchers: [
		"https://www.3djuegos.com/",
		"http://www.3djuegos.com?par1=0"
	],
	status: 1,
	title: "3D Juegos",
	typology: {
		id: 0,
		name: "Online Media"
	},
	url: "https://www.3djuegos.com"
};

describe('Insert online document store', () => {

	it('saga should set empty medias', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.get), availableMediasResponse],
			])
			.put(operators.setAvailableMedias({ medias: [] }))
			.dispatch(operators.fetchMedias({ media_url: 'a' }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						form: {
							online: {
								availableMedias: []
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should set available medias', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.get), availableMediasResponse],
			])
			.put(operators.setAvailableMedias({ medias }))
			.dispatch(operators.fetchMedias({ media_url: 'urlTest' }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						form: {
							online: {
								availableMedias: medias
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should set available medias error', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: {
					insert: {
						form: {
							online: {
								availableMedias: []
							}
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)],
			])
			.put(operators.fetchMediasError({ error }))
			.dispatch(operators.fetchMedias({ media_url: 'urlTest' }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga should fetch media info', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.get), [mediaInfoResponse]],
			])
			.dispatch(operators.fetchMediaInfo({ media_id: '1133177530' }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						form: {
							online: {
								fetchedMedia: mediaInfoResponse
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should fetch media info empty media id case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.dispatch(operators.fetchMediaInfo({ media_id: '' }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga should fetch media empty response case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.get), []],
			])
			.dispatch(operators.fetchMediaInfo({ media_id: '1133177530' }))
			.hasFinalState(getFullState())
			.silentRun();
	});

	it('saga should fetch media info error case', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				article: {
					insert: {
						form: {
							online: {
								fetchedMedia: mediaInfoResponse
							}
						}
					}
				}
			}))
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)],
			])
			.put(operators.fetchMediaInfoError({ error }))
			.dispatch(operators.fetchMediaInfo({ media_id: '1133177530' }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						form: {
							online: {
								fetchedMedia: null
							}
						}
					}
				}
			}))
			.silentRun();
	});

	it('saga should include custom suggestion when fetching medias', () => {
		const expectedMedias = union(medias, [{ id: '-1', name: "'" + i18n.t('custom') + "'", url: 'suggestion.com' }]);
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.get), availableMediasResponse],
			])
			.put(operators.setAvailableMedias({ medias: expectedMedias }))
			.dispatch(operators.fetchMedias({ media_url: 'suggestion.com' }))
			.hasFinalState(getFullState({
				article: {
					insert: {
						form: {
							online: {
								availableMedias: expectedMedias
							}
						}
					}
				}
			}))
			.silentRun();
	});
});
