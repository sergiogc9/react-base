import { expectSaga } from 'redux-saga-test-plan';
import merge from 'lodash/merge';
import moment from 'moment';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/search/form';
import { operators as resultsOperators } from '@src/store/search/results';
import { operators as notificationsOperators } from '@src/store/app/notifications';

import { State as FormState } from '@src/store/search/form/reducers';
import { State } from '@src/store/types';
import { UserObject, Settings as UserSettings } from '@src/class/User';
import { SearchMinDate, SearchMaxDate } from '@src/types/search/form';

const form: FormState = {
	query: '',
	sort: 'publication_date:desc',
	period: 'last_week',
	begin_date: null,
	end_date: null,
	date_type: 'publication_date',
	limit: 20,
	start: 0
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
	email: "fakeMail",
	permissions: [],
	facebook_linked_ids: [],
	settings: userSettings
};

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Form reducer', () => {

	it('reducer set whole form', () => {
		expect(reducers(
			getFullState(),
			operators.setForm({ form })
		).search.form)
			.toMatchObject({
				...form
			});
	});

	it('reducer set sort', () => {
		expect(reducers(
			getFullState({ search: { form: { start: 100 } } }),
			operators.setSort({ sort: 'reach:desc' })
		).search.form)
			.toMatchObject({
				...form,
				sort: 'reach:desc',
				start: 0
			});
	});

	it('reducer set query', () => {
		expect(reducers(
			getFullState(),
			operators.setQuery({ query: 'pepe' })
		).search.form)
			.toMatchObject({
				...form,
				query: 'pepe'
			});
	});

	it('reducer set limit', () => {
		expect(reducers(
			getFullState({ search: { form: { start: 100 } } }),
			operators.setLimit({ limit: 200 })
		).search.form)
			.toMatchObject({
				...form,
				limit: 200,
				start: 0
			});
	});

	it('reducer set start', () => {
		expect(reducers(
			getFullState(),
			operators.setStart({ start: 200 })
		).search.form)
			.toMatchObject({
				...form,
				start: 200
			});
	});

	it('reducer set period and not custom range', () => {
		expect(reducers(
			getFullState(),
			operators.setPeriodAndDatesRange({ period: "last_three_months" })
		).search.form)
			.toMatchObject({
				...form,
				period: "last_three_months",
				begin_date: null,
				end_date: null
			});
	});

	it('reducer set period and custom range', () => {
		const begin_date = moment().subtract('1', 'month').toDate();
		const end_date = moment().toDate();
		expect(reducers(
			getFullState(),
			operators.setPeriodAndDatesRange({ period: "custom", begin_date, end_date })
		).search.form)
			.toMatchObject({
				...form,
				period: "custom",
				begin_date,
				end_date
			});
	});

	it('reducer set search date type', () => {
		expect(reducers(
			getFullState(),
			operators.setDateType({ type: 'integration_date' })
		).search.form)
			.toMatchObject({
				...form,
				date_type: 'integration_date'
			});
	});

	it('saga should set sort', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setSort({ sort: "echo:desc" }))
			.hasFinalState(getFullState({
				search: {
					form: {
						...form,
						sort: "echo:desc"
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should submit', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.submit())
			.hasFinalState(getFullState({
				search: {
					form: {
						...form
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set limit', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setLimit({ limit: 100 }))
			.hasFinalState(getFullState({
				search: {
					form: {
						...form,
						limit: 100
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set start', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setStart({ start: 200 }))
			.hasFinalState(getFullState({
				search: {
					form: {
						...form,
						start: 200
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set period equal to previous', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.not.put(operators.setPeriodAndDatesRange({ period: "last_week", begin_date: undefined, end_date: undefined }))
			.dispatch(operators.setPeriod({ period: "last_week" }))
			.hasFinalState(getFullState({
				search: {
					form: {
						...form,
						period: "last_week"
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set period not equal to previous', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.setPeriodAndDatesRange({ period: "last_month", begin_date: undefined, end_date: undefined }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setPeriod({ period: "last_month" }))
			.hasFinalState(getFullState({
				search: {
					form: {
						...form,
						period: "last_month"
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should set period from custom to not custom', () => {
		const beginDate = new Date(0);
		const endDate = new Date();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({ search: { form: { period: "custom", begin_date: beginDate, end_date: endDate } } })) // withState always after withReducer
			.put(operators.setPeriodAndDatesRange({ period: "last_week", begin_date: undefined, end_date: undefined }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setPeriod({ period: "last_week" }))
			.hasFinalState(getFullState({
				search: {
					form: {
						...form,
						period: "last_week",
						begin_date: beginDate,
						end_date: endDate
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	const setPeriodIterationsData = [
		{
			name: "saga should set custom period previous last week",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			previousPeriod: "last_week"
		},
		{
			name: "saga should set custom period previous last month",
			begin_date: moment().startOf('day').subtract(1, 'month').toDate(),
			end_date: moment().endOf('day').toDate(),
			previousPeriod: "last_month"
		},
		{
			name: "saga should set custom period previous last 3 month",
			begin_date: moment().startOf('day').subtract(3, 'month').toDate(),
			end_date: moment().endOf('day').toDate(),
			previousPeriod: "last_three_months"
		},
		{
			name: "saga should set custom period previous next 15 days",
			begin_date: moment().startOf('day').toDate(),
			end_date: moment().endOf('day').add(15, 'days').toDate(),
			previousPeriod: "next_fifteen_days"
		}
	];

	for (const iteration of setPeriodIterationsData) {
		it(iteration.name, () => {
			const begin_date = iteration.begin_date;
			const end_date = iteration.end_date;
			const previousPeriod = iteration.previousPeriod;
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					app: { profile: { user } },
					search: { form: { period: previousPeriod } }
				})) // withState always after withReducer
				.put(operators.setPeriodAndDatesRange({ period: "custom", begin_date, end_date }))
				.dispatch(operators.setPeriod({ period: "custom" }))
				.hasFinalState(getFullState({
					app: { profile: { user } },
					search: {
						form: {
							...form,
							period: "custom",
							begin_date,
							end_date
						}
					}
				}))
				.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
		});
	}

	const setBeginDateIterationsData = [
		{
			name: "saga should set begin date",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_begin_date: moment().startOf('day').subtract(2, 'month').toDate(),
			final_begin_date: moment().startOf('day').subtract(2, 'month').toDate()
		},
		{
			name: "saga should set begin date bigger than end date",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_begin_date: moment().startOf('day').add(2, 'month').toDate(),
			final_begin_date: moment().endOf('day').toDate()
		},
		{
			name: "saga should set begin date smaller than minimum",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_begin_date: moment().startOf('day').subtract(5, 'year').toDate(),
			final_begin_date: moment(SearchMinDate).toDate()
		},
		{
			name: "saga should set begin date bigger than minimum",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_begin_date: moment().add(5, 'year').toDate(),
			final_begin_date: moment().endOf('day').toDate()
		}
	];

	for (const iteration of setBeginDateIterationsData) {
		it(iteration.name, () => {
			const begin_date = iteration.begin_date;
			const end_date = iteration.end_date;
			const new_begin_date = iteration.new_begin_date;
			const final_begin_date = iteration.final_begin_date;
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					app: { profile: { user: { ...user, permissions: ["search.unrestricted_period"] } } },
					search: { form: { period: "custom", begin_date, end_date } }
				})) // withState always after withReducer
				.put(operators.setPeriodAndDatesRange({ period: "custom", begin_date: final_begin_date, end_date }))
				.put(resultsOperators.fetchSearch())
				.dispatch(operators.setBeginDate({ date: new_begin_date }))
				.hasFinalState(getFullState({
					app: { profile: { user: { ...user, permissions: ["search.unrestricted_period"] } } },
					search: {
						form: {
							...form,
							period: "custom",
							begin_date: final_begin_date,
							end_date
						},
						results: { loadingDocuments: true }
					}
				}))
				.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
		});
	}

	const setEndDateIterationsData = [
		{
			name: "saga should set end date",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_end_date: moment().endOf('day').add(2, 'month').toDate(),
			final_end_date: moment().endOf('day').add(2, 'month').toDate()
		},
		{
			name: "saga should set end date smaller than begin date",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_end_date: moment().endOf('day').subtract(2, 'month').toDate(),
			final_end_date: moment().startOf('day').subtract(1, 'week').toDate()
		},
		{
			name: "saga should set end date smaller than minimum",
			begin_date: moment().startOf('day').subtract(1, 'week').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_end_date: moment().endOf('day').subtract(5, 'year').toDate(),
			final_end_date: moment().startOf('day').subtract(1, 'week').toDate()
		},
		{
			name: "saga should set end date bigger than minimum",
			begin_date: moment().startOf('day').toDate(),
			end_date: moment().endOf('day').toDate(),
			new_end_date: moment().endOf('day').add(5, 'year').toDate(),
			final_end_date: moment(SearchMaxDate).toDate()
		}
	];

	for (const iteration of setEndDateIterationsData) {
		it(iteration.name, () => {
			const begin_date = iteration.begin_date;
			const end_date = iteration.end_date;
			const new_end_date = iteration.new_end_date;
			const final_end_date = iteration.final_end_date;
			return expectSaga(sagas)
				.withReducer(reducers)
				.withState(getFullState({
					app: { profile: { user } },
					search: { form: { period: "custom", begin_date, end_date } }
				})) // withState always after withReducer
				.put(operators.setPeriodAndDatesRange({ period: "custom", begin_date, end_date: final_end_date }))
				.put(resultsOperators.fetchSearch())
				.dispatch(operators.setEndDate({ date: new_end_date }))
				.hasFinalState(getFullState({
					app: { profile: { user } },
					search: {
						form: {
							...form,
							period: "custom",
							begin_date,
							end_date: final_end_date
						},
						results: { loadingDocuments: true }
					}
				}))
				.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
		});
	}

	it("saga should set begin date before 3 months to end date without permissions", () => {
		const begin_date = moment().startOf('day').subtract(1, 'week').toDate();
		const end_date = moment().endOf('day').toDate();
		const new_begin_date = moment().startOf('day').subtract(4, 'months').toDate();
		const final_end_date = moment().endOf('day').subtract(1, 'months').toDate();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user } },
				search: { form: { period: "custom", begin_date, end_date } }
			})) // withState always after withReducer
			.put(notificationsOperators.add({ notification: { t: "error.search_period.more_than_3_months" } }))
			.put(operators.setPeriodAndDatesRange({ period: "custom", begin_date: new_begin_date, end_date: final_end_date }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setBeginDate({ date: new_begin_date }))
			.hasFinalState(getFullState({
				app: { profile: { user } },
				search: {
					form: {
						...form,
						period: "custom",
						begin_date: new_begin_date,
						end_date: final_end_date
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it("saga should set end date after 3 months from begin date without permissions ", () => {
		const begin_date = moment().startOf('day').subtract(1, 'year').toDate();
		const end_date = moment().endOf('day').toDate();
		const new_end_date = moment().startOf('day').add(2, 'months').toDate();
		const final_begin_date = moment().startOf('day').subtract(1, 'months').toDate();
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState({
				app: { profile: { user } },
				search: { form: { period: "custom", begin_date, end_date } }
			})) // withState always after withReducer
			.put(notificationsOperators.add({ notification: { t: "error.search_period.more_than_3_months" } }))
			.put(operators.setPeriodAndDatesRange({ period: "custom", begin_date: final_begin_date, end_date: new_end_date }))
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setEndDate({ date: new_end_date }))
			.hasFinalState(getFullState({
				app: { profile: { user } },
				search: {
					form: {
						...form,
						period: "custom",
						begin_date: final_begin_date,
						end_date: new_end_date
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it("saga should set search date", () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.put(resultsOperators.fetchSearch())
			.dispatch(operators.setDateType({ type: 'integration_date' }))
			.hasFinalState(getFullState({
				search: {
					form: {
						...form,
						date_type: 'integration_date'
					},
					results: { loadingDocuments: true }
				}
			}))
			.silentRun();
	});
});
