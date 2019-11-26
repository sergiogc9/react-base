import { expectSaga } from 'redux-saga-test-plan';
import queryString from 'query-string';
import merge from 'lodash/merge';
import moment from 'moment';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas, resetSearchData } from '@src/store/search';
import { operators as resultsOperators } from '@src/store/search/results';
import { operators as formOperators } from '@src/store/search/form';
import { operators as filtersOperators } from '@src/store/search/filters';

import { State as FormState, INITIAL_STATE as FormStateInitial } from '@src/store/search/form/reducers';
import { State as FiltersState, INITIAL_STATE as FiltersStateInitial } from '@src/store/search/filters/reducers';
import { State } from '@src/store/types';
import { UserObject, Settings as UserSettings } from '@src/class/User';
import { Settings as TenantSettings, TenantObject } from '@src/class/Tenant';

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
	email: "fake@mail.com",
	permissions: [],
	facebook_linked_ids: [],
	settings: userSettings
};

const tenantSettings: TenantSettings = {
	categorization_mode: 'all',
	currency: 'EUR',
	display_influencers: true,
	facebook_url: '',
	valuation_metric: 'miv',
	document_tenant_indices_search: true
};

const tenant: TenantObject = {
	id: "fakeId",
	guid: "fake-guid",
	name: "fakeName",
	tier_properties: {
		name: "facekName",
		limit: 0,
		results: {
			online: true,
			social: true
		}
	},
	settings: tenantSettings,
	print_only: true,
	facebook_linked_ids: []
};

const facetFiltersTxt = "&facetFilters=%7B\"channel_type_id\"%3A%5B%7B\"key\"%3A\"24\"%7D%5D%7D";
const focusFiltersTxt = "&focusFilters=focus1,focus2";
const feedsFiltersTxt = "&feedFilters=feed1,feed2";
const queryTxt = `?period=last_week&limit=30&start=10${facetFiltersTxt}${focusFiltersTxt}${feedsFiltersTxt}`;
const query = queryString.parse(queryTxt);
const formState: FormState = {
	...FormStateInitial,
	period: "last_week",
	limit: 30,
	start: 10
};

const filtersState: FiltersState = {
	...FiltersStateInitial,
	facetsGroups: { channel_type_id: [{ key: "24" }] },
	focus: ["focus1", "focus2"],
	feeds: ["feed1", "feed2"]
};

const queryTxtWithDateRange = "?period=custom&begin_date=20190316&end_date=20190416";
const queryWithDateRange = queryString.parse(queryTxtWithDateRange);
const formStateWithDateRange: FormState = {
	...FormStateInitial,
	period: "custom",
	begin_date: moment("20190316", "YYYYMMDD").toDate(),
	end_date: moment("20190416", "YYYYMMDD").endOf('day').toDate()
};
const filtersStateWithDateRange: FiltersState = {
	...FiltersStateInitial
};

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Search store', () => {

	it('saga should set form and filters', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { user } }, search: { form: { query: "toremove" } } })) // withState always after withReducer
			.call(resetSearchData)
			.put(formOperators.setForm({ form: formState }))
			.put(filtersOperators.setFilters({ filters: filtersState }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setFormAndFilters({ query }))
			.hasFinalState(getFullState({
				app: { profile: { user } },
				search: {
					form: {
						...formState
					},
					filters: {
						...filtersState
					},
					facets: { loadingFacets: true },
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set form and filters with custom date range', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { user } }, search: { form: { query: "toremove" } } })) // withState always after withReducer
			.call(resetSearchData)
			.put(formOperators.setForm({ form: formStateWithDateRange }))
			.put(filtersOperators.setFilters({ filters: filtersStateWithDateRange }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setFormAndFilters({ query: queryWithDateRange }))
			.hasFinalState(getFullState({
				app: { profile: { user } },
				search: {
					form: {
						...formStateWithDateRange
					},
					filters: {
						...filtersStateWithDateRange
					},
					facets: { loadingFacets: true },
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set sort fiel', () => {
		const queryTxtWithSort = "?sort=publication_date:desc";
		const queryWithSort = queryString.parse(queryTxtWithSort);
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant, user } } }))
			.call(resetSearchData)
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setFormAndFilters({ query: queryWithSort }))
			.hasFinalState(getFullState({
				app: { profile: { tenant, user } },
				search: {
					form: {
						sort: 'publication_date:desc'
					},
					facets: { loadingFacets: true },
					results: { loadingDocuments: true }
				}
			}))
			.silentRun();
	});

	it('saga should change audience sort field given wrong sort', () => {
		const queryTxtWithSort = "?sort=audience:desc";
		const queryWithSort = queryString.parse(queryTxtWithSort);
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant, user } } }))
			.call(resetSearchData)
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setFormAndFilters({ query: queryWithSort }))
			.hasFinalState(getFullState({
				app: { profile: { tenant, user } },
				search: {
					form: {
						sort: 'reach:desc'
					},
					facets: { loadingFacets: true },
					results: { loadingDocuments: true }
				}
			}))
			.silentRun();
	});

	it('saga should change date type', () => {
		const queryTxtWithDateType = "?date_type=integration_date";
		const queryWithDateType = queryString.parse(queryTxtWithDateType);
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ app: { profile: { tenant, user } } }))
			.call(resetSearchData)
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setFormAndFilters({ query: queryWithDateType }))
			.hasFinalState(getFullState({
				app: { profile: { tenant, user } },
				search: {
					form: {
						date_type: 'integration_date'
					},
					facets: { loadingFacets: true },
					results: { loadingDocuments: true }
				}
			}))
			.silentRun();
	});
});
