import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { reducers } from 'store';
import { actions, INITIAL_STATE } from 'store/ui/counter';
import selectors from 'store/ui/counter/selectors';
import sagas, { delay } from 'store/ui/counter/sagas';
import { getApiError, getFullState, getStore } from '__tests__/utils/redux';

let store = getStore();

describe('UI Store', () => {

	it('should have initial state', () => {
		expect(getFullState().ui.counter).toMatchObject(INITIAL_STATE);
	});

	it('should change state with increment counter reducer', () => {
		expect(reducers(
			getFullState({ ui: { counter: { value: 1 } } }),
			actions.increment()
		).ui.counter)
			.toMatchObject({
				value: 2
			});
	});

	it('should change state with set value reducer', () => {
		expect(reducers(
			getFullState({ ui: { counter: { value: 1 } } }),
			actions.setValue(30)
		).ui.counter)
			.toMatchObject({
				value: 30
			});
	});

	it('should change state with fetch counter start reducer', () => {
		expect(reducers(
			getFullState(),
			actions.fetchCounterStart(500)
		).ui.counter)
			.toMatchObject({
				value: 500
			});
	});

	it('should change state with fetch counter success reducer', () => {
		expect(reducers(
			getFullState({ ui: { counter: { value: 1 } } }),
			actions.fetchCounterSuccess(20)
		).ui.counter)
			.toMatchObject({
				value: 20
			});
	});

	it('should change state with fetch counter error reducer', () => {
		expect(reducers(
			getFullState(),
			actions.fetchCounterError(getApiError())
		).ui.counter)
			.toMatchObject(getFullState().ui.counter);
	});

	it('should execute fetch counter saga', async () => {
		await expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([
				[call.fn(delay), null]
			])
			.put(actions.fetchCounterSuccess(30))
			.dispatch(actions.fetchCounterStart(10))
			.hasFinalState(getFullState({
				ui: { counter: { value: 30 } }
			}))
			.silentRun();
	});

	it('should call getValue selector', () => {
		store = getStore();
		expect(selectors.getValue(store.getState())).toEqual(10);
		store.dispatch(actions.fetchCounterStart(20));
		expect(selectors.getValue(store.getState())).toEqual(20);
	});

});
