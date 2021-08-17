import { PokemonType } from 'types/entities/pokemon';

export type PokemonAddFormValues = {
	baseExperience: number;
	description: string;
	name: string;
	type: PokemonType;
};
