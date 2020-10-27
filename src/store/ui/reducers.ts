import { createSlice, getApiReducers } from 'lib/store/reducer';

export type State = {
	loading: boolean
};

export const INITIAL_STATE: State = {
	loading: false
};

// Only needed to use in sagas
export type Payloads = {
	fetchData: void
}

const [fetchDataStart, fetchDataSuccess, fetchDataError] = getApiReducers<State, Payloads["fetchData"]>({
	start: (state, { payload }) => { state.loading = true; },
	success: (state, { payload }) => { state.loading = false; },
	error: (state, { payload }) => { state.loading = false; }
});

const { actions, reducer } = createSlice({
	name: '@@ui',
	initialState: INITIAL_STATE,
	reducers: {
		fetchDataStart, fetchDataSuccess, fetchDataError
	}
});

export { actions, reducer };
