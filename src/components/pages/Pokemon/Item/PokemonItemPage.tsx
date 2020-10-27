import React from 'react';
import { useGetPokemonItem } from 'queries/pokemon';

const PokemonItemPage: React.FC = () => {
	const { data, isLoading } = useGetPokemonItem("10");

	return (
		<div>
			<p>Pokemon item page</p>
			{isLoading && <p>Loading!</p>}
			{data && <p>Name: {data.name}</p>}
			{data && <p>Experience: {data.base_experience}</p>}
		</div>
	);
};

export default PokemonItemPage;
