import axiosMock from 'jest-mock-axios';

import Api from 'lib/ajax/api';

const reqHeaders = {
	// 'Accept-Language': 'en',
	// Authorization: 'Bearer token'
};

const mockGetUser = jest.fn();
const mockDoLogin = jest.fn();
const mockRedirectToSSO = jest.fn();

jest.mock('lib/auth', () => {
	return {
		getUser: () => mockGetUser(),
		doLogin: () => mockDoLogin(),
		redirectToSSO: () => mockRedirectToSSO()
	};
});

describe('Api', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		axiosMock.reset();
		axiosMock.request.mockClear();
		axiosMock.request.mockResolvedValue({ data: 'bar' });
		mockGetUser.mockResolvedValue({
			access_token: 'token',
			expires_at: new Date().getTime() / 1000 + 3600
		});
	});

	it('should perform success get request', async () => {
		const api = new Api();
		const res = await api.get('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'get',
			headers: reqHeaders
		});
	});

	it('should perform success post request', async () => {
		const api = new Api();
		const res = await api.post('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'post',
			headers: reqHeaders
		});
	});

	it('should perform success put request', async () => {
		const api = new Api();
		const res = await api.put('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'put',
			headers: reqHeaders
		});
	});

	it('should perform success patch request', async () => {
		const api = new Api();
		const res = await api.patch('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'patch',
			headers: reqHeaders
		});
	});

	it('should perform success delete request', async () => {
		const api = new Api();
		const res = await api.delete('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'delete',
			headers: reqHeaders
		});
	});

	it('should perform controlled api error', async () => {
		axiosMock.request.mockRejectedValueOnce({
			response: { data: { code: 'FAKE_CODE' } }
		});

		const api = new Api();
		await expect(api.get('/foo')).rejects.toEqual({ code: 'FAKE_CODE', data: { code: 'FAKE_CODE' } });
		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'get',
			headers: reqHeaders
		});
	});

	it('should perform controlled api error with validation errors', async () => {
		axiosMock.request.mockRejectedValueOnce({
			response: { data: { code: 'FAKE_CODE', validationErrors: { Email: 'Wrong email' } } }
		});

		const api = new Api();
		await expect(api.get('/foo')).rejects.toEqual({
			code: 'FAKE_CODE',
			data: { code: 'FAKE_CODE', validationErrors: { email: 'Wrong email' } }
		});
		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'get',
			headers: reqHeaders
		});
	});

	it('should perform controlled cancelled api error', async () => {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		axiosMock.request.mockRejectedValueOnce({ __CANCEL__: 1 });

		const source = Api.getCancelTokenSource();
		source.cancel('Test cancellation');

		const api = new Api();
		await expect(api.get('/foo', { cancelToken: source.token })).rejects.toEqual({
			code: 'AXIOS_CANCELLED',
			message: 'request cancelled'
		});
		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'get',
			headers: reqHeaders,
			cancelToken: source.token
		});
	});

	it('should perform uncontrolled api error with status code', async () => {
		axiosMock.request.mockRejectedValueOnce({ response: { status: '500' } });

		const api = new Api();
		await expect(api.get('/foo')).rejects.toEqual({ code: 'API_ERROR', message: 'API error: (500)' });
		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'get',
			headers: reqHeaders
		});
	});

	it('should perform uncontrolled api error without status code', async () => {
		axiosMock.request.mockRejectedValueOnce({ response: {} });

		const api = new Api();
		await expect(api.get('/foo')).rejects.toEqual({ code: 'API_DOWN', message: 'Api is down' });
		expect(axiosMock.request).toHaveBeenCalledWith({
			url: '/foo',
			method: 'get',
			headers: reqHeaders
		});
	});

	it('should retry 3 times if authentication fails', async () => {
		axiosMock.request.mockRejectedValue({ response: { status: 401 } });

		const api = new Api();
		await expect(api.get('/foo')).rejects.toEqual({
			code: 'API_AUTHENTICATION_FAILED',
			message: 'Could not authenticate'
		});
		expect(axiosMock.request).toHaveBeenCalledTimes(3);
	});

	it('should redirect to sso if authentication fails', async () => {
		axiosMock.request.mockRejectedValue({ response: { status: 401 } });

		const api = new Api();
		await expect(api.get('/foo')).rejects.toEqual({
			code: 'API_AUTHENTICATION_FAILED',
			message: 'Could not authenticate'
		});
		expect(mockRedirectToSSO).toHaveBeenCalled();
	});

	it('should refresh token if authentication fails', async () => {
		axiosMock.request.mockResolvedValue({ data: 'bar' });
		axiosMock.request.mockRejectedValueOnce({ response: { status: 401 } });

		const api = new Api();
		let finalResponse;
		try {
			finalResponse = await api.get('/foo');
		} catch (err) {} // eslint-disable-line no-empty
		expect(mockDoLogin).toHaveBeenCalled();
		expect(finalResponse).toEqual('bar');
	});

	// eslint-disable-next-line jest/no-commented-out-tests
	// it('should call api with changed language', async () => {
	// 	Api.setLanguage('es');
	// 	const api = new Api();
	// 	const res = await api.get('/foo');
	// 	expect(res).toEqual('bar');

	// 	expect(axiosMock.request).toHaveBeenCalledWith({
	// 		url: '/foo',
	// 		method: 'get',
	// 		headers: { ...reqHeaders, 'Accept-Language': 'es' }
	// 	});
	// });

	// eslint-disable-next-line jest/no-commented-out-tests
	// it('should update token if expired', async () => {
	// 	mockGetUser.mockResolvedValue({
	// 		access_token: 'token',
	// 		expires_at: new Date().getTime() / 1000 - 3600
	// 	});

	// 	const api = new Api();
	// 	await api.get('/foo');
	// 	expect(mockDoLogin).toHaveBeenCalledTimes(1);
	// });

	// eslint-disable-next-line jest/no-commented-out-tests
	// it('should update token if invalid', async () => {
	// 	mockGetUser.mockResolvedValue(null);

	// 	const api = new Api();
	// 	await api.get('/foo');
	// 	expect(mockDoLogin).toHaveBeenCalledTimes(1);
	// });
});
