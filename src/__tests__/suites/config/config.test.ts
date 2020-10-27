describe('Config lib', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it("should return dev config", () => {
		process.env.REACT_APP_ENVIRONMENT = 'dev';
		const config = require('config').default;
		expect(config.environment).toBe('dev');
		expect(config.isDevelopmentEnvironment()).toBe(true);
	});

	it("should return pre config", () => {
		process.env.REACT_APP_ENVIRONMENT = 'pre';
		const config = require('config').default;
		expect(config.environment).toBe('pre');
		expect(config.isDevelopmentEnvironment()).toBe(true);
	});

	it("should return staging config", () => {
		process.env.REACT_APP_ENVIRONMENT = 'staging';
		const config = require('config').default;
		expect(config.environment).toBe('staging');
		expect(config.isDevelopmentEnvironment()).toBe(false);
	});

	it("should return prod config", () => {
		process.env.REACT_APP_ENVIRONMENT = 'prod';
		const config = require('config').default;
		expect(config.environment).toBe('prod');
		expect(config.isDevelopmentEnvironment()).toBe(false);
	});

	it("should throw exception if environment is not valid", () => {
		process.env.REACT_APP_ENVIRONMENT = 'unknown';
		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const config = require('config').default;
		}).toThrow();
	});
});
