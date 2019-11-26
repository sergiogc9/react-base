import axiosMock from 'jest-mock-axios';

// add missing axios request mock
axiosMock.request = jest.fn(({ url, method, ...config }: { url: string, method: string, config: object }) => axiosMock.get(url, null, config));

const mockReset = axiosMock.reset;
axiosMock.reset = () => {
	mockReset();
	// add missing mockClear
	axiosMock.request.mockClear();
	axiosMock.create.mockClear();
};

export default axiosMock;
