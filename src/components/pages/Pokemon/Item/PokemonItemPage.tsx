import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Content, Grid, Title } from '@sergiogc9/react-ui';

import Loading from 'components/ui/Loading';
import { useGetPokemonItem } from 'queries/pokemon';

const PokemonItemPage: React.FC = () => {
	const params = useParams();

	const { data: pokemon, isLoading } = useGetPokemonItem(params.id!);

	return (
		<Box alignItems="center" flexDirection="column" id="pokemonItemPage" width="100%">
			<Title aspectSize="l">Pokemon item page</Title>
			{isLoading && <Loading />}
			{pokemon && (
				<Grid columns={12} mt={5} width={300}>
					<Grid.Box columns={6}>
						<Content fontWeight="bold">ID:</Content>{' '}
					</Grid.Box>
					<Grid.Box columns={6} justifyContent="flex-end">
						{pokemon.id}
					</Grid.Box>
					<Grid.Box columns={6}>
						<Content fontWeight="bold">Name:</Content>{' '}
					</Grid.Box>
					<Grid.Box columns={6} justifyContent="flex-end">
						{pokemon.name}
					</Grid.Box>
					<Grid.Box columns={6}>
						<Content fontWeight="bold">Base experience:</Content>{' '}
					</Grid.Box>
					<Grid.Box columns={6} justifyContent="flex-end">
						{pokemon.base_experience}
					</Grid.Box>
				</Grid>
			)}
		</Box>
	);
};

export default React.memo(PokemonItemPage);
