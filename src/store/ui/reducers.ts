import { createSlice, getApiReducers, getReducer } from '@sergiogc9/react-utils';

export type State = {
	readonly isFakeLoading: boolean;
	readonly isPageScrolled: boolean;
	readonly isPageFullScrolled: boolean;
	readonly pendingLoadingBarApiCalls: number;
};

export const INITIAL_STATE: State = {
	isFakeLoading: true,
	isPageScrolled: false,
	isPageFullScrolled: false,
	pendingLoadingBarApiCalls: 0
};

const setIsPageScrolled = getReducer<State, boolean>((state, { payload: isScrolled }) => {
	state.isPageScrolled = isScrolled;
});

const setIsPageFullScrolled = getReducer<State, boolean>((state, { payload: isFullScrolled }) => {
	state.isPageFullScrolled = isFullScrolled;
});

const addPendingLoadingBarApiCall = getReducer<State>(state => {
	state.pendingLoadingBarApiCalls++;
});

const removePendingLoadingBarApiCall = getReducer<State>(state => {
	state.pendingLoadingBarApiCalls--;
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
		addPendingLoadingBarApiCall,
		fetchDataStart,
		fetchDataSuccess,
		fetchDataError,
		removePendingLoadingBarApiCall,
		setIsPageScrolled,
		setIsPageFullScrolled
	}
});

export { actions, reducer };
