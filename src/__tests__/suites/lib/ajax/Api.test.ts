import axiosMock from 'jest-mock-axios';
import moment from 'moment';
import server from '@src/lib/ajax/server';
import Api, { NAP_BASE_URL, TER_BASE_URL, NAP_VERSION, TER_VERSION, APP_VERSION, connectApi } from '@src/lib/ajax/Api';

// add missing axios request mock
// axiosMock.request = jest.fn(({ url, ...rest }: { url: string, rest: object }) => axiosMock.get(url, null, rest));

const baseConfig = {
	baseURL: `${TER_BASE_URL}/${TER_VERSION}`,
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
		// axiosMock.request.mockClear();
		// axiosMock.create.mockClear();
	});

	it('should initialize Nap search namespace', () => {
		const api = new Api('search');
		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.create).toHaveBeenCalledWith({ ...baseConfig, baseURL: `${NAP_BASE_URL}/search/${NAP_VERSION}` });
	});

	it('should initialize Nap insights namespace', () => {
		const api = new Api('insights');
		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.create).toHaveBeenCalledWith({ ...baseConfig, baseURL: `${NAP_BASE_URL}/insights/${NAP_VERSION}` });
	});

	it('should initialize Nap insights namespace and version', () => {
		const api = new Api('insights', 'v2');
		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.create).toHaveBeenCalledWith({ ...baseConfig, baseURL: `${NAP_BASE_URL}/insights/v2` });
	});

	it('should initialize Ter', () => {
		const api = new Api();
		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.create).toHaveBeenCalledWith({ ...baseConfig, baseURL: `${TER_BASE_URL}/${TER_VERSION}` });
	});

	it('should initialize Ter and version', () => {
		const api = new Api('', 'v2');
		expect(axiosMock.create).toHaveBeenCalledTimes(1);
		expect(axiosMock.create).toHaveBeenCalledWith({ ...baseConfig, baseURL: `${TER_BASE_URL}/v2` });
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

	it('should perform refresh expired token before request', done => {
		Api.storeApiAccessData({ token, token_expires_at: moment().subtract(1, 'h').format() });

		const newSessionApi = {
			token: 'someothertoken',
			token_expires_at: moment().add(1, 'h').format()
		};

		server.getUpdatedSession = jest.fn(async () => Promise.resolve({} as any)); // mock get token from server lib
		const dispatch = jest.fn(() => { Api.storeApiAccessData(newSessionApi); }); // simulate setSession action
		connectApi({ dispatch } as any);

		const newHeaders = {
			Authorization: `Bearer ${newSessionApi.token}`
		};

		axiosMock.request = jest.fn(({ url, ...rest }: { url: string, rest: object }) => axiosMock.get(url, null, rest));

		const api = new Api();
		api.get('/foo').then(res => {
			expect(res).toEqual('bar');
			done();
		});

		// Api _refreshSession is async, this checks must be done in an async block in order to test after _refreshSession ended
		setTimeout(() => {
			expect(server.getUpdatedSession).toHaveBeenCalled();
			expect(dispatch).toHaveBeenCalled();

			expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: newHeaders });

			axiosMock.mockResponse({ data: { response: 'bar' } });
		}, 0);

	});

	it('should perform refresh token after error request', done => {
		Api.storeApiAccessData({ token, token_expires_at: tokenExpiresAt });

		const newSessionApi = {
			token: 'someothertoken',
			token_expires_at: moment().add(1, 'h').format()
		};

		server.getUpdatedSession = jest.fn(async () => Promise.resolve({} as any)); // mock get token from server lib
		const dispatch = jest.fn(() => { Api.storeApiAccessData(newSessionApi); }); // simulate setSession action
		connectApi({ dispatch } as any);

		const newHeaders = {
			Authorization: `Bearer ${newSessionApi.token}`
		};

		const api = new Api();

		api.get('/foo').then(res => {
			expect(res).toEqual('bar');
			done();
		});

		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: reqHeaders });

		axiosMock.mockError({ response: { data: { error: { code: 'OAUTH2_TOKEN_NOT_VALID' } } } });

		// Api _refreshSession is async, this checks must be done in an async block in order to test after _refreshSession ended
		setTimeout(() => {
			expect(server.getUpdatedSession).toHaveBeenCalled();
			expect(dispatch).toHaveBeenCalled();
			expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: newHeaders });

			axiosMock.mockResponse({ data: { response: 'bar' } });
		}, 0);

	});

});
