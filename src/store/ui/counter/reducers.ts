import { createSlice, getReducer, getApiReducers } from '@sergiogc9/react-utils';

export type State = {
	value: number;
};

export const INITIAL_STATE: State = {
	value: 10
};

// Only needed to use in sagas
export type Payloads = {
	fetchCounterStart: number;
};

const increment = getReducer<State, void>(state => {
	state.value += 1;
});
const setValue = getReducer<State, number>((state, { payload: newValue }) => {
	state.value = newValue;
});
const [fetchCounterStart, fetchCounterSuccess, fetchCounterError] = getApiReducers<
	State,
	Payloads['fetchCounterStart'],
	number
>({
	start: (state, { payload }) => {
		state.value = payload;
	},
	success: (state, { payload }) => {
		state.value = payload;
	}
});

const { actions, reducer } = createSlice({
	name: '@@ui/counter',
	initialState: INITIAL_STATE,
	reducers: {
		increment,
		setValue,
		fetchCounterStart,
		fetchCounterSuccess,
		fetchCounterError
	}
});

export { actions, reducer };
