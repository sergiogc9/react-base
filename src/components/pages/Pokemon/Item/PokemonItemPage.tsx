import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Flex, Grid, Text, Title } from '@sergiogc9/react-ui';

import Loading from 'components/ui/Loading';
import { useGetPokemonItem } from 'queries/pokemon';

const PokemonItemPage: React.FC = () => {
	const params = useParams();

	const { data: pokemon, isLoading } = useGetPokemonItem(params.id!);

	return (
		<Flex alignItems="center" flexDirection="column" id="pokemonItemPage" width="100%">
			{pokemon && (
				<Helmet>
					<title>Pokemon: {pokemon.name}</title>
				</Helmet>
			)}
			<Title aspectSize="l">Pokemon item page</Title>
			{isLoading && <Loading />}
			{pokemon && (
				<Grid columns={12} mt={5} width={300}>
					<Grid.Box columns={6}>
						<Text fontWeight="bold">ID:</Text>{' '}
					</Grid.Box>
					<Grid.Box columns={6} justifyContent="flex-end">
						{pokemon.id}
					</Grid.Box>
					<Grid.Box columns={6}>
						<Text fontWeight="bold">Name:</Text>{' '}
					</Grid.Box>
					<Grid.Box columns={6} justifyContent="flex-end">
						{pokemon.name}
					</Grid.Box>
					<Grid.Box columns={6}>
						<Text fontWeight="bold">Base experience:</Text>{' '}
					</Grid.Box>
					<Grid.Box columns={6} justifyContent="flex-end">
						{pokemon.base_experience}
					</Grid.Box>
				</Grid>
			)}
		</Flex>
	);
};

export default React.memo(PokemonItemPage);
