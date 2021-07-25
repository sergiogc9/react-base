import { createSlice, getApiReducers, getReducer } from '@sergiogc9/react-utils';

import { UserProfile } from 'types/entities/user';

export type State = {
	readonly isAuthenticated: boolean;
	readonly profile: UserProfile | null;
};

export const INITIAL_STATE: State = {
	isAuthenticated: false,
	profile: null
};

// Only needed to use in sagas
export type Payloads = {
	setIsAuthenticated: boolean;
	fetchAuth: void;
	fetchAuthSuccess: void;
	fetchAuthError: void;
	setProfile: UserProfile | null;
};

const [fetchAuth, fetchAuthSuccess, fetchAuthError] = getApiReducers<State, Payloads['fetchAuth']>({
	start: state => {
		state.isAuthenticated = false;
	},
	success: state => {
		state.isAuthenticated = true;
	},
	error: state => {
		state.isAuthenticated = false;
	}
});

const setProfile = getReducer<State, Payloads['setProfile']>((state, { payload: profile }) => {
	state.profile = profile;
});

const { actions, reducer } = createSlice({
	name: '@@auth',
	initialState: INITIAL_STATE,
	reducers: {
		fetchAuth,
		fetchAuthSuccess,
		fetchAuthError,
		setProfile
	}
});

export { actions, reducer };
