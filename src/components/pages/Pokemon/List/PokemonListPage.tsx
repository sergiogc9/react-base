import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from 'react-error-boundary';
import { useTheme } from 'styled-components';
import { Column } from 'react-table';
import { Box, Button, Content, Title } from '@sergiogc9/react-ui';

import Link from 'components/ui/Link';
import Table from 'components/ui/Table';
import { useGetPokemonList } from 'queries/pokemon';
import { ListPokemon } from 'types/entities/pokemon';

import PokemonsListSkeleton from './skeleton';

const PokemonItemList: React.FC = () => {
	const navigate = useNavigate();

	const { data, error } = useGetPokemonList();

	// TODO! don't use the hook, use the config in react-query middleware
	useErrorHandler(error);

	const theme = useTheme();

	const columns = React.useMemo<Column<ListPokemon>[]>(
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
					<Button aspectSize="s" onClick={() => navigate(`/pokemon/${props.value}`)} variant="primary" {...props}>
						See pokemon
					</Button>
				),
				getCellWidthText: () => 'See pokemon'
			}
		],
		[navigate]
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
		<Box id="pokemonListPage" flexDirection="column" height="calc(100vh - 100px)" px={{ md: 6, xs: 3 }} py={4}>
			{data ? (
				<>
					<Title aspectSize="s">Pokemons</Title>
					{tableContent}
				</>
			) : (
				<PokemonsListSkeleton />
			)}
		</Box>
	);
};

export default React.memo(PokemonItemList);
