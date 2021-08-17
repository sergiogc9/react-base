import { ApiConfig } from 'types/notification';

const successConfig: ApiConfig = {
	common: {},
	redux: {},
	reactQuery: {
		pokemon: {
			addPokemon: {
				level: 'success',
				t: 'pages.pokemon_add.save.success'
			}
		}
	}
};

export default successConfig;
