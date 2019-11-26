import { Action, actionCreatorFactory } from 'typescript-fsa';

const actionCreator = actionCreatorFactory('@@app/auth');

type Payloads = {
	FetchAuth: void;
	FetchAuthSuccess: void;
	FetchAuthError: { error: object };
}

export type Actions = {
	FetchAuth: Action<Payloads["FetchAuth"]>;
	FetchAuthSuccess: Action<Payloads["FetchAuthSuccess"]>;
	FetchAuthError: Action<Payloads["FetchAuthError"]>;
}

export const operators = {
	fetchAuth: actionCreator<Payloads["FetchAuth"]>('FETCH_AUTH', { api: 'start' }),
	fetchAuthSuccess: actionCreator<Payloads["FetchAuthSuccess"]>('FETCH_AUTH_SUCCESS', { api: 'success' }),
	fetchAuthError: actionCreator<Payloads["FetchAuthError"]>('FETCH_AUTH_ERROR', { api: 'error' })
};
