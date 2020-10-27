import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { reducers } from 'store';
import { actions, INITIAL_STATE } from 'store/ui';
import selectors from 'store/ui/selectors';
import sagas, { delay } from 'store/ui/sagas';
import { getApiError, getFullState, getStore } from '__tests__/utils/redux';

let store = getStore();

describe('UI Store', () => {

	it('should have initial state', () => {
		expect(getFullState().ui).toMatchObject(INITIAL_STATE);
	});

	it('should change state with fetch data start reducer', () => {
		expect(reducers(
			getFullState(),
			actions.fetchDataStart()
		).ui)
			.toMatchObject({
				_: { loading: true }
			});
	});

	it('should change state with fetch data success reducer', () => {
		expect(reducers(
			getFullState({ ui: { _: { loading: true } } }),
			actions.fetchDataSuccess()
		).ui)
			.toMatchObject({
				_: { loading: false }
			});
	});

	it('should change state with fetch data error reducer', () => {
		expect(reducers(
			getFullState({ ui: { _: { loading: true } } }),
			actions.fetchDataError(getApiError())
		).ui)
			.toMatchObject({
				_: { loading: false }
			});
	});

	it('should execute fetch data saga', async () => {
		await expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[call.fn(delay), null]
			])
			.put(actions.fetchDataSuccess())
			.dispatch(actions.fetchDataStart())
			.silentRun();
	});

	it('should call getLoading selector', () => {
		store = getStore();
		expect(selectors.getLoading(store.getState())).toEqual(false);
		store.dispatch(actions.fetchDataStart());
		expect(selectors.getLoading(store.getState())).toEqual(true);
	});

});
