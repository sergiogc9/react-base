import axiosMock from 'jest-mock-axios';
import moment from 'moment';
import Api, { API_BASE_URL, APP_VERSION, connectApi } from '@src/lib/ajax/Api';

// add missing axios request mock
// axiosMock.request = jest.fn(({ url, ...rest }: { url: string, rest: object }) => axiosMock.get(url, null, rest));

const baseConfig = {
	baseURL: `${API_BASE_URL}`,
	headers: {
		'Content-Type': 'application/json',
		'X-App-Version': APP_VERSION
	}
};

const token = 'somerandomtesttoken';
const tokenExpiresAt = moment().add(1, 'h').format();
const reqHeaders = { Authorization: `Bearer ${token}` };

describe('Api', () => {

	beforeEach(() => {
		axiosMock.reset();
	});

	it('should initialize Ter', () => {
		const api = new Api();
		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.create).toHaveBeenCalledWith({ ...baseConfig, baseURL: `${API_BASE_URL}` });
	});

	it('should perform success get request', done => {
		Api.storeApiAccessData({ token, token_expires_at: tokenExpiresAt });

		const api = new Api();

		api.get('/foo').then(res => {
			expect(res).toEqual('bar');
			done();
		});

		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: reqHeaders });

		axiosMock.mockResponse({ data: { response: 'bar' } });

	});

	it('should perform error get request', done => {
		Api.storeApiAccessData({ token, token_expires_at: tokenExpiresAt });

		const api = new Api();

		api.get('/foo').catch(err => {
			expect(err).toEqual({ code: 'SOME_CODE' });
			done();
		});

		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: reqHeaders });

		axiosMock.mockError({ response: { data: { error: { code: 'SOME_CODE' } } } });
	});

	// it('should perform refresh expired token before request', done => {
	// 	Api.storeApiAccessData({ token, token_expires_at: moment().subtract(1, 'h').format() });

	// 	const newSessionApi = {
	// 		token: 'someothertoken',
	// 		token_expires_at: moment().add(1, 'h').format()
	// 	};

	// 	const dispatch = jest.fn(() => { Api.storeApiAccessData(newSessionApi); }); // simulate setSession action
	// 	connectApi({ dispatch } as any);

	// 	const newHeaders = {
	// 		Authorization: `Bearer ${newSessionApi.token}`
	// 	};

	// 	axiosMock.request = jest.fn(({ url, ...rest }: { url: string, rest: object }) => axiosMock.get(url, null, rest));

	// 	const api = new Api();
	// 	api.get('/foo').then(res => {
	// 		expect(res).toEqual('bar');
	// 		done();
	// 	});

	// 	// Api _refreshSession is async, this checks must be done in an async block in order to test after _refreshSession ended
	// 	setTimeout(() => {
	// 		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: newHeaders });

	// 		axiosMock.mockResponse({ data: { response: 'bar' } });
	// 	}, 0);

	// });

	// it('should perform refresh token after error request', done => {
	// 	Api.storeApiAccessData({ token, token_expires_at: tokenExpiresAt });

	// 	const newSessionApi = {
	// 		token: 'someothertoken',
	// 		token_expires_at: moment().add(1, 'h').format()
	// 	};

	// 	const dispatch = jest.fn(() => { Api.storeApiAccessData(newSessionApi); }); // simulate setSession action
	// 	connectApi({ dispatch } as any);

	// 	const newHeaders = {
	// 		Authorization: `Bearer ${newSessionApi.token}`
	// 	};

	// 	const api = new Api();

	// 	api.get('/foo').then(res => {
	// 		expect(res).toEqual('bar');
	// 		done();
	// 	});

	// 	expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: reqHeaders });

	// 	axiosMock.mockError({ response: { data: { error: { code: 'OAUTH2_TOKEN_NOT_VALID' } } } });

	// 	// Api _refreshSession is async, this checks must be done in an async block in order to test after _refreshSession ended
	// 	setTimeout(() => {
	// 		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: newHeaders });

	// 		axiosMock.mockResponse({ data: { response: 'bar' } });
	// 	}, 0);

	// });

});
