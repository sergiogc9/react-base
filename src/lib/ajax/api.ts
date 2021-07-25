import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
// import { DateTime } from 'luxon';
import { get, lowerFirst, transform } from 'lib/imports/lodash';

import appConfig from 'config';
import authManager from 'lib/auth';

import { ApiLanguage, ApiMethod } from './types';

export default class Api {
	protected _client: AxiosInstance;
	private static language: ApiLanguage = 'en';

	constructor() {
		const apiConfig: AxiosRequestConfig = {
			maxRedirects: 0,
			baseURL: `${appConfig.apiUrl}/v2/`,
			headers: {
				'Content-Type': 'application/json'
			}
		};
		this._client = axios.create(apiConfig);
	}

	private async _request<T = any>(
		method: ApiMethod,
		url: string,
		config: AxiosRequestConfig = {},
		retry = 0
	): Promise<T> {
		// if (await this.__isTokenExpired()) await this.__refreshSession(); // TODO! uncomment once implemented

		const requestConfig: AxiosRequestConfig = {
			headers: {},
			...config,
			method,
			url
		};
		// requestConfig.headers['Accept-Language'] = Api.language; // TODO! uncomment once implemented
		// requestConfig.headers.Authorization = `Bearer ${await this.__getToken()}`; // TODO! uncomment once implemented

		try {
			const response = await this._client.request(requestConfig);
			return response.data;
		} catch (err) {
			if (axios.isCancel(err)) throw { code: 'AXIOS_CANCELLED', message: 'request cancelled' };

			const errorCode = get(err, 'response.data.code');
			// Handle non controlled api errors
			if (!errorCode) {
				const statusCode = get(err, 'response.status');
				if (statusCode === 401) {
					// Authentication error
					if (retry < 2) {
						await this.__refreshSession();
						return this._request(method, url, config, ++retry);
					}
					authManager.redirectToSSO();
					throw { code: 'API_AUTHENTICATION_FAILED', message: 'Could not authenticate' };
				} else if (statusCode) throw { code: 'API_ERROR', message: `API error: (${statusCode})` };
				else throw { code: 'API_DOWN', message: 'Api is down' };
			}
			// Handle controlled api errors
			if (get(err, 'response.data.validationErrors')) {
				err.response.data.validationErrors = transform<string, Record<string, string>>(
					err.response.data.validationErrors,
					(result, value, key: string) => {
						result[lowerFirst(key)] = value;
					},
					{}
				);
			}
			throw {
				code: errorCode,
				message: get(err, 'response.data.userMessages[0]'),
				data: get(err, 'response.data')
			};
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

	public static setLanguage(language: ApiLanguage) {
		Api.language = language;
	}

	public static getCancelTokenSource() {
		return axios.CancelToken.source();
	}

	private async __refreshSession() {
		await authManager.doLogin();
	}

	// private async __getToken() {
	// 	const user = await authManager.getUser();
	// 	if (!user) return null;
	// 	return user.access_token;
	// }

	// private async __isTokenExpired() {
	// 	const user = await authManager.getUser();
	// 	if (!user) return true;
	// 	return DateTime.fromSeconds(user.expires_at) < DateTime.now();
	// }
}
