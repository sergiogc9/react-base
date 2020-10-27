import axiosMock from 'jest-mock-axios';

import Api from 'lib/ajax/api';
// import config from 'config';
// const baseConfig = {
// 	baseURL: config.apiUrl + 'Web/v1/',
// 	headers: {
// 		'Content-Type': 'application/json'
// 	}
// };
const reqHeaders = {};

describe('Api', () => {

	beforeEach(() => {
		axiosMock.reset();
		axiosMock.request.mockClear();
	});

	it('should initialize api', () => {
		new Api();
	});

	it('should perform success get request', async () => {
		axiosMock.request.mockResolvedValueOnce({ data: 'bar' } as any);

		const api = new Api();
		const res = await api.get('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: reqHeaders });
	});

	it('should perform success post request', async () => {
		axiosMock.request.mockResolvedValueOnce({ data: 'bar' } as any);

		const api = new Api();
		const res = await api.post('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'post', headers: reqHeaders });
	});

	it('should perform success put request', async () => {
		axiosMock.request.mockResolvedValueOnce({ data: 'bar' } as any);

		const api = new Api();
		const res = await api.put('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'put', headers: reqHeaders });
	});

	it('should perform success patch request', async () => {
		axiosMock.request.mockResolvedValueOnce({ data: 'bar' } as any);

		const api = new Api();
		const res = await api.patch('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'patch', headers: reqHeaders });
	});

	it('should perform success delete request', async () => {
		axiosMock.request.mockResolvedValueOnce({ data: 'bar' } as any);

		const api = new Api();
		const res = await api.delete('/foo');
		expect(res).toEqual('bar');

		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'delete', headers: reqHeaders });
	});

	it('should perform controlled api error', async () => {
		axiosMock.request.mockRejectedValueOnce({ response: { data: { code: 'FAKE_CODE' } } });

		const api = new Api();
		try {
			await api.get('/foo');
		} catch (err) {
			expect(err).toEqual({ code: 'FAKE_CODE' });
		}
		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: reqHeaders });
	});

	it('should perform controlled cancelled api error', async () => {
		axiosMock.request.mockRejectedValueOnce({ __CANCEL__: 1 });

		const source = Api.getCancelTokenSource();
		source.cancel('Test cancellation');

		const api = new Api();
		try {
			await api.get('/foo', { cancelToken: source.token });
		} catch (err) {
			expect(err).toEqual({ code: 'AXIOS_CANCELLED', message: 'request cancelled' });
		}
		expect(axiosMock.request).toHaveBeenCalledWith({ url: '/foo', method: 'get', headers: reqHeaders, cancelToken: source.token });
	});
});
