import { ApiConfig } from 'types/notification';

const errorConfig: ApiConfig = {
	common: {},
	redux: {
		'@@entities/book': {
			t: ['api.error_with_message', { message: { path: 'message' } }],
			level: 'warning',
			reload: true
		}
	},
	reactQuery: {
		// TODO!! use some example for pokemon api calls
	}
};

export default errorConfig;
