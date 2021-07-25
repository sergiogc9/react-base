import { createSlice, getApiReducers, getReducer } from '@sergiogc9/react-utils';

export type State = {
	readonly isFakeLoading: boolean;
	readonly isPageScrolled: boolean;
};

export const INITIAL_STATE: State = {
	isFakeLoading: false,
	isPageScrolled: false
};

const setIsPageScrolled = getReducer<State, boolean>((state, { payload: isScrolled }) => {
	state.isPageScrolled = isScrolled;
});

const [fetchDataStart, fetchDataSuccess, fetchDataError] = getApiReducers<State, Payloads['fetchData']>({
	start: state => {
		state.isFakeLoading = true;
	},
	success: state => {
		state.isFakeLoading = false;
	},
	error: state => {
		state.isFakeLoading = false;
	}
});

// Only needed to use in sagas
export type Payloads = {
	fetchData: void;
};

const { actions, reducer } = createSlice({
	name: '@@ui',
	initialState: INITIAL_STATE,
	reducers: {
		fetchDataStart,
		fetchDataSuccess,
		fetchDataError,
		setIsPageScrolled
	}
});

export { actions, reducer };
