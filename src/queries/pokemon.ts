import Api from 'lib/ajax/api';

import { useApiQuery } from 'middleware/api/react-query';
import { ListPokemon, Pokemon } from 'types/entities/pokemon';

const apiActionBase = 'pokemon/';

export const useGetPokemonList = () => {
	const getData = async () => {
		const api = new Api();
		await new Promise(resolve => setTimeout(resolve, 700));
		const { results } = await api.get<{ results: ListPokemon[] }>('/pokemon', { params: { limit: 50 } });

		return results.map((pokemon, i) => ({ ...pokemon, id: i + 1 }));
	};

	return useApiQuery<ListPokemon[]>(`${apiActionBase}getPokemonList`, 'pokemons', getData);
};

export const useGetPokemonItem = (id: string) => {
	const getData = async () => {
		const api = new Api();
		await new Promise(resolve => setTimeout(resolve, 1000));
		return api.get(`/pokemon/${id}`);
	};

	return useApiQuery<Pokemon>(`${apiActionBase}getPokemonItem`, ['pokemons', { id }], getData);
};
