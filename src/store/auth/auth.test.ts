/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { reducers } from 'store';
import sagas from 'store/auth/sagas';
import { actions, INITIAL_STATE } from 'store/auth';
import selectors from 'store/auth/selectors';
import { getFullState, getStore } from 'lib/tests/redux';
import TestUtils from 'lib/tests';
import authManager from 'lib/auth';
import Api from 'lib/ajax/api';

let store = getStore();

const userProfile = TestUtils.getUserProfile();

jest.mock('lib/auth', () => {
	return {
		getUser: jest.fn(),
		doLogin: jest.fn()
	};
});

const error = { code: 'error', message: 'fake error' };

describe('Auth store', () => {
	beforeAll(() => {
		// eslint-disable-next-line no-console
		console.error = jest.fn();
	});

	it('should have initial state', () => {
		expect(getFullState().auth).toMatchObject(INITIAL_STATE);
	});

	it('should fetch authenticated', () => {
		expect(reducers(getFullState({ auth: { isAuthenticated: true } }), actions.fetchAuth()).auth).toMatchObject({
			isAuthenticated: false
		});
	});

	it('should fetch authenticated success', () => {
		expect(reducers(getFullState(), actions.fetchAuthSuccess()).auth).toMatchObject({
			isAuthenticated: true
		});
	});

	it('should fetch authenticated error', () => {
		expect(
			reducers(getFullState({ auth: { isAuthenticated: true } }), actions.fetchAuthError(error)).auth
		).toMatchObject({
			isAuthenticated: false
		});
	});

	it('should execute start auth saga with user previously authenticated', async () => {
		authManager.getUser = jest.fn().mockResolvedValueOnce(TestUtils.getUserProfile());
		await expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([[matchers.call.fn(Api.prototype.get), userProfile]])
			.put(actions.fetchAuthSuccess())
			.dispatch(actions.fetchAuth())
			.hasFinalState(
				getFullState({
					auth: { isAuthenticated: true, profile: userProfile }
				})
			)
			.silentRun();
	});

	it('should execute start auth saga and log in user when user not logged in', async () => {
		authManager.getUser = jest.fn().mockResolvedValueOnce(null);
		authManager.doLogin = jest.fn().mockResolvedValueOnce(TestUtils.getUserProfile());
		await expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([[matchers.call.fn(Api.prototype.get), userProfile]])
			.put(actions.fetchAuthSuccess())
			.dispatch(actions.fetchAuth())
			.hasFinalState(
				getFullState({
					auth: { isAuthenticated: true, profile: userProfile }
				})
			)
			.silentRun();
	});

	it('should fail auth if user session fails', async () => {
		authManager.getUser = jest.fn().mockRejectedValueOnce(error);
		await expectSaga(sagas)
			.withReducer(reducers)
			.withState(getFullState())
			.provide([[matchers.call.fn(Api.prototype.get), throwError(error as any)]])
			.put(actions.fetchAuthError(error))
			.dispatch(actions.fetchAuth())
			.hasFinalState(
				getFullState({
					auth: { isAuthenticated: false, profile: null }
				})
			)
			.silentRun();
	});

	it('should call isAuthenticated selector', () => {
		store = getStore();
		expect(selectors.isAuthenticated(store.getState())).toEqual(false);
		store.dispatch(actions.fetchAuthSuccess());
		expect(selectors.isAuthenticated(store.getState())).toEqual(false);
		store.dispatch(actions.setProfile(userProfile));
		expect(selectors.isAuthenticated(store.getState())).toEqual(true);
	});

	it('should call getUserProfile selector', () => {
		store = getStore();
		expect(selectors.getUserProfile(store.getState())).toEqual(null);
		store.dispatch(actions.setProfile(userProfile));
		expect(selectors.getUserProfile(store.getState())).toEqual(userProfile);
	});
});
