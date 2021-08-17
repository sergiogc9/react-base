export type Pokemon = {
	base_experience: number;
	id: number;
	name: string;
};

export type ListPokemon = {
	id: number;
	name: string;
	url: string;
};

export const pokemonTypes = ['poison', 'electric', 'fire', 'ghost', 'grass'] as const;
export type PokemonType = typeof pokemonTypes[number];
