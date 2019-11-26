import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import merge from 'lodash/merge';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators, sagas } from '@src/store/article/categorization';
import Api from '@src/lib/ajax/Api';

import { State } from '@src/store/types';

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Categorization reducer', () => {

	it('reducer fetch tags', () => {
		expect(reducers(
			getFullState(),
			operators.fetchTags()
		).article.categorization)
			.toMatchObject({
				tags: []
			});
	});

	it('reducer fetch tags success', () => {
		expect(reducers(
			getFullState(),
			operators.fetchTagsSuccess({ tags: [{ tag: "test", occurences: 2 }] })
		).article.categorization)
			.toMatchObject({
				tags: [{ tag: "test", occurences: 2 }]
			});
	});

	it('reducer fetch tags error', () => {
		const error = new Error('SOME_ERROR');
		expect(reducers(
			getFullState(),
			operators.fetchTagsError({ error })
		).article.categorization)
			.toMatchObject({
				tags: []
			});
	});

	it('saga should fetch tags', () => {
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.put(operators.fetchTagsSuccess({ tags: [{ tag: "test", occurences: 2 }] }))
			.dispatch(operators.fetchTags())
			.provide([
				[matchers.call.fn(Api.prototype.get), [{ tag: "test", occurences: 2 }]],
			])
			.hasFinalState(getFullState({
				article: {
					categorization: {
						tags: [{ tag: "test", occurences: 2 }]
					}
				}
			}))
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});

	it('saga should fetch tags error', () => {
		const error = new Error('SOME_ERROR');
		return expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState()) // withState always after withReducer
			.provide([
				[matchers.call.fn(Api.prototype.get), throwError(error)],
			])
			.put(operators.fetchTagsError({ error }))
			.dispatch(operators.fetchTags())
			.hasFinalState(getFullState())
			.silentRun(); // silentRun to hide timeout warning. this saga uses takeLatest so it never ends. Default timeout is 250 ms
	});
});
