import merge from 'lodash/merge';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import Api from '@src/lib/ajax/Api';
import server from '@src/lib/ajax/server';
import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/app/common';
import { State } from '@src/store/types';

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

const timezones = ["Europe/Girona", "Europe/Palencia"];

const error = new Error();

describe('Common store', () => {

	it('reducer should set timezones', () => {
		expect(reducers(
			getFullState(),
			operators.setTimezones({ timezones })
		).app.common)
			.toMatchObject({
				timezones
			});
	});

	it('reducer fetch timezones error', () => {
		expect(reducers(
			getFullState({ app: { common: { timezones } } }),
			operators.fetchTimezonesError({ error })
		).app.common)
			.toMatchObject({
				timezones: null
			});
	});

	it('saga should fetch timezones', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.get), { timezones }]
			])
			.put(operators.setTimezones({ timezones }))
			.dispatch(operators.fetchTimezones())
			.hasFinalState(getFullState({
				app: {
					common: {
						timezones
					}
				}
			}))
			.silentRun();
	});

	it('saga should fail fetch timezones', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)]
			])
			.put(operators.fetchTimezonesError({ error }))
			.dispatch(operators.fetchTimezones())
			.hasFinalState(getFullState({
				app: {
					common: {
						timezones: null
					}
				}
			}))
			.silentRun();
	});
});
