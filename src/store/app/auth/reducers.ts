import { createReducer, ReducerHandlers } from '@src/lib/reducer';
import { operators } from './actions';

export type State = {
	readonly authenticated: boolean
};

export const INITIAL_STATE: State = {
	authenticated: false
};

const reducerHandlers: ReducerHandlers<State> = {
	fetchAuthSuccess: (state): State => ({
		...state,
		authenticated: true
	}),
	fetchAuthError: (state): State => ({
		...state,
		authenticated: false
	})
};

export const reducers = createReducer<State>(INITIAL_STATE, reducerHandlers, operators);
