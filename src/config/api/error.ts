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
		pokemon: {
			addPokemon: {
				level: 'error',
				t: 'pages.pokemon_add.save.error'
			}
		}
	}
};

export default errorConfig;
