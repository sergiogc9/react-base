import devConfig from './env/dev';
import prodConfig from './env/prod';

export type Config = {
	environment: 'dev' | 'prod';
	apiUrl: string;
};

let config: Config;
if (process.env.REACT_APP_ENVIRONMENT === 'dev') config = devConfig;
else if (process.env.REACT_APP_ENVIRONMENT === 'prod') config = prodConfig;
else throw new Error('Environment not defined!!');

const commonConfig = {};

// Dev (local) and pre environments are set as development environments. Logs and debug are enabled in both environments
const isDevelopmentEnvironment = () => ['dev'].includes(config.environment);

export default {
	isDevelopmentEnvironment,
	...commonConfig,
	...config
};
