import { ApiConfig } from "types/notification";

const successConfig: ApiConfig = {
	common: {},
	redux: {
		"@@ui/counter": {
			fetchCounterSuccess: {
				t: 'api.success',
				level: 'success',
				timeout: false
			}
		}
	},
	reactQuery: {
		pokemon: {
			getPokemonList: {
				t: 'api.success',
				level: 'success'
			}
		}
	}
};

export default successConfig;
