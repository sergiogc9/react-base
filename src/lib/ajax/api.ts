import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { get } from 'lib/imports/lodash';

import config from 'config';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export default class Api {

	private _client: AxiosInstance;
	private _refreshSessionPromise: Promise<void> | null = null;

	constructor() {
		const apiConfig: AxiosRequestConfig = {
			baseURL: config.apiUrl + 'Web/v1/',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		this._client = axios.create(apiConfig);
	}

	private async _request<T = any>(method: Method, url: string, config: AxiosRequestConfig = {}, retry: number = 0): Promise<T> {
		// if (Api._isTokenExpired()) await this._refreshSession(); // TODO use instance method instead of static?

		const requestConfig: AxiosRequestConfig = { headers: {}, ...config, method, url };
		// requestConfig.headers.Authorization = 'Bearer ' + Api._token(); // TODO use instance method instead of static?

		try {
			const response = await this._client.request(requestConfig);
			return response.data;
		} catch (err) {
			if (axios.isCancel(err)) throw { code: 'AXIOS_CANCELLED', message: 'request cancelled' };

			const error = get(err, "response.data");
			// if (!error) throw { code: 'API_DOWN', message: 'Api is down' };
			// if (!error.code) throw { code: 'API_UNKNOWN_ERROR', message: 'Api unknown error' };
			// if (error.code === 'OAUTH2_TOKEN_NOT_VALID') {
			// 	if (retry < 2) {
			// 		// await this._refreshSession();
			// 		return this._request(method, url, config, ++retry);
			// 	}
			// 	throw { code: 'API_AUTHENTICATION_FAILED', message: 'Could not authenticate' };
			// }
			throw error;
		}
	}

	public async get<T = any>(url: string, config?: AxiosRequestConfig) {
		return this._request<T>('get', url, config);
	}

	public async post<T = any>(url: string, config?: AxiosRequestConfig) {
		return this._request<T>('post', url, config);
	}

	public async put<T = any>(url: string, config?: AxiosRequestConfig) {
		return this._request<T>('put', url, config);
	}

	public async patch<T = any>(url: string, config?: AxiosRequestConfig) {
		return this._request<T>('patch', url, config);
	}

	public async delete<T = any>(url: string, config?: AxiosRequestConfig) {
		return this._request<T>('delete', url, config);
	}

	// request updated session with new token and updated profile
	// private async _refreshSession() {
	// 	if (this._refreshSessionPromise) {
	// 		await this._refreshSessionPromise;
	// 	} else {
	// 		this._refreshSessionPromise = new Promise(async resolve => {
	// 			Api.clearAuthData(); // prevent new requests with expired token
	// 			const session = await server.getUpdatedSession();
	// 			Api.setAuthData(session.api); // update token
	// 			dispatchSetProfile(session.profile); // update profile
	// 			resolve();
	// 		});
	// 		await this._refreshSessionPromise;
	// 		this._refreshSessionPromise = null;
	// 	}
	// }

	// private static _token(): string | null {
	// 	return terStorage.getToken();
	// }

	// private static _isTokenExpired(): boolean {
	// 	const expiration = terStorage.getTokenExpiresAt();
	// 	return !expiration || moment().isAfter(expiration);
	// }

	// public static setAuthData(sessionApiData: Session['api']) {
	// 	terStorage.setToken(sessionApiData.token);
	// 	terStorage.setTokenExpiresAt(sessionApiData.token_expires_at);
	// }

	// public static clearAuthData() {
	// 	terStorage.clear();
	// }

	public static getCancelTokenSource() {
		return axios.CancelToken.source();
	}
}

// dispatch function requires connection with store
// type DispatchSetProfile = (session: Session['profile']) => void;
// let dispatchSetProfile: DispatchSetProfile = () => {
// 	console.error('[Api] Store not connected in order to dispatch setSession action');
// };
// export function connectApi(store: Store) {
// 	dispatchSetProfile = (profile: Session['profile']) => {
// 		store.dispatch(profileOperators.setProfile(profile));
// 	};
// }
