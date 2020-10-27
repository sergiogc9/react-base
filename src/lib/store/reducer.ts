import { CaseReducer, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';

import { EntitiesFetchData } from 'store/entities';

// General reducer stuff
type CaseReducerWithPrepare<State, Payload> = {
	reducer: CaseReducer<State, {
		payload: Payload;
		type: string;
	}>;
	prepare: (payload: Payload) => {
		payload: Payload;
		meta: object | undefined;
	};
}

const getReducer = <State, Payload = void>(reducer: CaseReducer<State, PayloadAction<Payload>>, meta?: object): CaseReducerWithPrepare<State, Payload> => ({
	reducer,
	prepare: (payload: Payload) => ({ payload, meta })
});

// Api specific reducer stuff
export type DefaultPayloadError = { code: string, message: string };

type ApiOperatorOptions = {
	reload?: boolean // Used to reload page when optimistic api call fails
};

type ApiReducers<State, StartPayload, SuccessPayload, ErrorPayload> = {
	start?: CaseReducer<State, PayloadAction<StartPayload>>
	success?: CaseReducer<State, PayloadAction<SuccessPayload>>
	error?: CaseReducer<State, PayloadAction<ErrorPayload>>
}

const getApiReducers = <State, StartPayload = void, SuccessPayload = void, ErrorPayload = DefaultPayloadError>(
	reducers: ApiReducers<State, StartPayload, SuccessPayload, ErrorPayload>,
	options?: ApiOperatorOptions
): [
		CaseReducerWithPrepare<State, StartPayload>,
		CaseReducerWithPrepare<State, SuccessPayload>,
		CaseReducerWithPrepare<State, ErrorPayload>
	] => {
	const defaultReducer: CaseReducer<State> = state => state as State;
	return [
		getReducer<State, StartPayload>(reducers.start || defaultReducer, { api: 'start' }),
		getReducer<State, SuccessPayload>(reducers.success || defaultReducer, { api: 'success' }),
		getReducer<State, ErrorPayload>(reducers.error || defaultReducer, { api: 'error', reload: options?.reload })
	];
};

const getEntityFetchReducers = <T, StartPayload = void, SuccessPayload = void, ErrorPayload = DefaultPayloadError>() => {
	return getApiReducers<EntityState<T> & EntitiesFetchData, StartPayload, SuccessPayload, ErrorPayload>({
		start: state => { state.status = 'loading'; },
		success: state => { state.status = 'loaded'; },
		error: state => { state.status = 'error'; }
	});
};

export { getReducer, getApiReducers, getEntityFetchReducers, createSlice };
