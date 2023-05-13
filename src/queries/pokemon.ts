import Api from 'lib/ajax/api';
import { useQueryClient } from '@tanstack/react-query';
import { reject } from 'lib/imports/lodash';

import { useApiMutate, useApiQuery } from 'middleware/api/react-query';
import { ListPokemon, Pokemon, PokemonType } from 'types/entities/pokemon';

const apiActionBase = 'pokemon/';

const getPokemonListQueryKey = () => ['getPokemonList'];
export const useGetPokemonList = () => {
	const getData = async () => {
		const api = new Api();
		await new Promise(resolve => setTimeout(resolve, 700));
		const { results } = await api.get<{ results: ListPokemon[] }>('/pokemon', { params: { limit: 50 } });

		return results.map((pokemon, i) => ({ ...pokemon, id: i + 1 }));
	};

	return useApiQuery<ListPokemon[]>(apiActionBase + getPokemonListQueryKey(), getPokemonListQueryKey(), getData, {
		showLoadingBar: true
	});
};

export const useGetPokemonItem = (id: string) => {
	const getData = async () => {
		const api = new Api();
		await new Promise(resolve => setTimeout(resolve, 1000));
		return api.get(`/pokemon/${id}`);
	};

	return useApiQuery<Pokemon>(`${apiActionBase}getPokemonItem`, ['pokemons', { id }], getData, {
		useErrorBoundary: true,
		showLoadingBar: true
	});
};

export const useAddPokemon = () => {
	type Args = { pokemonData: { name: string; baseExperience: number; description: string; type: PokemonType } };
	const addPokemon = async () => {
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		// await Promise.reject(); // Simulate failure if wanted
	};

	return useApiMutate<any, any, Args>(`${apiActionBase}addPokemon`, addPokemon, { showLoadingBar: true });
};

export const useRemovePokemon = () => {
	const queryClient = useQueryClient();

	type Args = { pokemonId: number };
	const removePokemon = async ({ pokemonId }: Args) => {
		const currentPokemons = queryClient.getQueryData<ListPokemon[]>(getPokemonListQueryKey());

		queryClient.setQueryData<ListPokemon[]>(getPokemonListQueryKey(), reject(currentPokemons, { id: pokemonId }));

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			// await Promise.reject(); // Simulate failure if wanted
		} catch (e) {
			queryClient.setQueryData<ListPokemon[]>(getPokemonListQueryKey(), currentPokemons!);
			throw e;
		}
	};

	return useApiMutate<any, any, Args>(`${apiActionBase}removePokemon`, removePokemon);
};
