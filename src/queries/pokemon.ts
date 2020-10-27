import axios from 'axios';

import { useApiQuery } from 'middleware/api/react-query';

const apiActionBase = 'pokemon/';

export const useGetPokemonList = () => {
	const getData = async () => {
		// throw new Error();
		return (await axios.get<{ results: { name: string, url: string }[] }>('https://pokeapi.co/api/v2/pokemon')).data.results;
	};
	return useApiQuery(apiActionBase + 'getPokemonList', 'pokemons', getData, { refetchOnMount: false, refetchOnWindowFocus: false });
};

export const useGetPokemonItem = (id: string) => {
	const getData = async () => {
		return (await axios.get<{ name: string, base_experience: number }>(`https://pokeapi.co/api/v2/pokemon/${id}`)).data;
	};
	return useApiQuery(apiActionBase + 'getPokemonItem', ['pokemons', { id }], getData, { refetchOnMount: false, refetchOnWindowFocus: false });
};
