import axios, { AxiosInstance } from 'axios';
import moment from 'moment';
import { Store } from 'redux';
import { Action } from 'typescript-fsa';
import get from 'lodash/get';

import { operators as authOperators } from '@src/store/app/auth';
import { Session } from '@src/types/session';

export const API_BASE_URL = process.env.REACT_APP_API_URL;

export const APP_VERSION = process.env.REACT_APP_VERSION;

const apiConfig = {
	baseURL: `${API_BASE_URL}`,
	headers: {
		'Content-Type': 'application/json',
		'X-App-Version': APP_VERSION
	}
};

type Method = 'get' | 'post' | 'put' | 'delete';

export default class Api {

	private _ajax: AxiosInstance;

	constructor() {
		this._ajax = axios.create(apiConfig);
	}

	private async _request(method: Method, url: string, config: object = {}, retry: number = 0): Promise<any> {
		if (Api.isTokenExpired()) await Api.refreshSession();

		const request: { [index: string]: any } = { headers: {}, ...config, method, url };
		request.headers.Authorization = 'Bearer ' + Api.getToken();

		try {
			const response = await this._ajax.request(request);
			return response.data.response;
		} catch (err) {
			const error = get(err, "response.data.error");
			if (!error) throw { code: 'API_DOWN', message: 'Api is down' };
			if (!error.code) throw { code: 'API_UNKNOWN_ERROR', message: 'Api unknown error' };
			if (error.code === 'OAUTH2_TOKEN_NOT_VALID') {
				if (retry < 2) {
					await Api.refreshSession();
					return this._request(method, url, config, ++retry);
				}
				throw { code: 'API_AUTHENTICATION_FAILED', message: 'Could not authenticate' };
			}
			throw error;
		}
	}

	public async get(url: string, config?: object) {
		return this._request('get', url, config);
	}

	public async post(url: string, config?: object) {
		return this._request('post', url, config);
	}

	public async put(url: string, config?: object) {
		return this._request('put', url, config);
	}

	public async delete(url: string, config?: object) {
		return this._request('delete', url, config);
	}

	private static getToken() {
		return sessionStorage.getItem('api_access_token');
	}

	private static isTokenExpired() {
		const expiration = sessionStorage.getItem('api_access_token_expires_at');
		return !expiration || moment().isAfter(expiration);
	}

	// request updated session with new token and updated profile
	private static async refreshSession() {
		const session = await Api.getUpdatedSession();
		dispatch(authOperators.setSession({ session })); // calls storeApiAccessData to refresh token
	}

	private static async getUpdatedSession() {
		// Refresh session
		return {} as Session;
	}

	public static storeApiAccessData(sessionApiData: Session['api']) {
		sessionStorage.setItem('api_access_token', sessionApiData.token);
		sessionStorage.setItem('api_access_token_expires_at', sessionApiData.token_expires_at);
	}

	public static deleteSessionData() {
		sessionStorage.clear();
	}

}

// dispatch function requires connection with store
let dispatch = (action: Action<any>) => {
	console.warn('Store not connected on dispatch action from Api', action);
};
export function connectApi(store: Store) {
	dispatch = store.dispatch;
}
