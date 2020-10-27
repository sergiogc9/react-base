import { ApiConfig } from "types/notification";

const errorConfig: ApiConfig = {
	common: {},
	redux: {
		"@@entities/book": {
			t: ['api.error_with_message', { message: { path: 'message' } }],
			level: 'warning',
			reload: true
		}
	},
	reactQuery: {
		pokemon: {
			getPokemonList: {
				t: 'api.default_error',
				level: 'warning',
				reload: true
			}
		}
	}
};

export default errorConfig;
