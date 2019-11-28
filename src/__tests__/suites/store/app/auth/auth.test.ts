import merge from 'lodash/merge';
import { expectSaga } from 'redux-saga-test-plan';
import { call as callMatcher } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { reducers } from '@src/store';
import { INITIAL_STATE } from '@src/store';
import { operators } from '@src/store/app/auth';
import { State } from '@src/store/types';
import { Session } from '@src/types/session';

const error = new Error();

function getFullState(stateOverride: object = {}): State {
	return merge({}, INITIAL_STATE, stateOverride);
}

describe('Auth store', () => {

	it('reducer fetch auth success', () => {
		expect(reducers(
			getFullState({ app: { auth: { authenticated: false } } }),
			operators.fetchAuthSuccess()
		).app.auth)
			.toMatchObject({ authenticated: true });
	});

	it('reducer fetch auth error', () => {
		expect(reducers(
			getFullState({ app: { auth: { authenticated: true } } }),
			operators.fetchAuthError({ error })
		).app.auth)
			.toMatchObject({ authenticated: false });
	});

});
