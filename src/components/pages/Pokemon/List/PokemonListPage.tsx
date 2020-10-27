import React from 'react';
import { Link } from 'react-router-dom';
import { useGetPokemonList } from 'queries/pokemon';

const PokemonItemList: React.FC = () => {
	const { data } = useGetPokemonList();

	return (
		<div>
			<p>Pokemon list</p>
			{data && data.map(pokemon => <p key={pokemon.name}><Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link></p>)}
		</div>
	);
};

export default PokemonItemList;
