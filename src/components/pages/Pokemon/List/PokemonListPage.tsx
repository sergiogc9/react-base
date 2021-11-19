import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Content, Icon, IconButton, Table, TableColumn, Title } from '@sergiogc9/react-ui';

import Link from 'components/ui/Link';
import { useGetPokemonList, useRemovePokemon } from 'queries/pokemon';
import { ListPokemon } from 'types/entities/pokemon';

import PokemonsListSkeleton from './skeleton';

const PokemonItemList: React.FC = () => {
	const navigate = useNavigate();

	const { data } = useGetPokemonList();

	const { mutateAsync: removePokemon } = useRemovePokemon();

	const theme = useTheme();

	const columns = React.useMemo<TableColumn<ListPokemon>[]>(
		() => [
			{
				accessor: 'id',
				Cell: props => <Table.Cell.Default {...props} aspectSize="xs" color="neutral.600" />,
				Header: 'ID'
			},
			{
				accessor: 'name',
				Cell: props => <Table.Cell.Default {...props} fontWeight="bold" />,
				Header: 'Name'
			},
			{
				accessor: 'url',
				Header: 'Api url',
				Cell: props => (
					<Link to={props.value} {...props}>
						<Link.Text>{props.value}</Link.Text>
					</Link>
				)
			},
			{
				id: 'button',
				accessor: 'id',
				Header: '',
				Cell: props => (
					<Box justifyContent="flex-end" width="100%">
						<Button aspectSize="s" onClick={() => navigate(`/pokemon/${props.value}`)} variant="primary" {...props}>
							See pokemon
						</Button>
						<IconButton
							ml={3}
							onClick={() => removePokemon({ pokemonId: props.cell.row.original.id })}
							variant="default"
						>
							<Icon icon="delete" fill="primary.700" styling="outlined" />
						</IconButton>
					</Box>
				),
				getCellWidthText: () => 'See pokemon'
			}
		],
		[navigate, removePokemon]
	);

	const tableContent = React.useMemo(() => {
		if (!data) return null;

		return (
			<Table columns={columns} data={data} pb={4}>
				<Table.Toolbar>
					<Table.TotalResults
						render={({ totalResults }) => <Content aspectSize="xs">Total pokemons: {totalResults}</Content>}
					/>
					<Table.Pagination ml="auto" />
				</Table.Toolbar>
				<Table.Content minWidth={theme.breakpoints.lg} />
				<Table.Toolbar>
					<Table.Pagination ml="auto" />
				</Table.Toolbar>
			</Table>
		);
	}, [columns, data, theme.breakpoints.lg]);

	return (
		<Box id="pokemonListPage" flexDirection="column" px={{ md: 6, xs: 3 }} py={4}>
			{data ? (
				<>
					<Helmet>
						<title>Your pokemons</title>
					</Helmet>
					<Box alignItems="center" justifyContent="space-between">
						<Title aspectSize="s">Pokemons</Title>
						<Button aspectSize="s" onClick={() => navigate('add')} variant="secondary">
							<Button.Icon aspectSize="s" icon="add" styling="outlined" />
							<Button.Text aspectSize="s">Add pokemon</Button.Text>
						</Button>
					</Box>
					{tableContent}
				</>
			) : (
				<PokemonsListSkeleton />
			)}
		</Box>
	);
};

export default React.memo(PokemonItemList);
