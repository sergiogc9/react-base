import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import {
	Button,
	createColumnHelper,
	Flex,
	Icon,
	IconButton,
	Popover,
	Table,
	TableCellProps,
	Text,
	Title
} from '@sergiogc9/react-ui';
import { ActionMenu, Dialog } from '@sergiogc9/react-ui-collections';

import Link from 'components/ui/Link';
import { useGetPokemonList, useRemovePokemon } from 'queries/pokemon';
import { ListPokemon } from 'types/entities/pokemon';

import PokemonsListSkeleton from './skeleton';

const columnHelper = createColumnHelper<ListPokemon>();

const PokemonItemList: React.FC = () => {
	const navigate = useNavigate();

	const { data } = useGetPokemonList();

	const { mutateAsync: removePokemon } = useRemovePokemon();

	const theme = useTheme();

	const [deletingPokemonId, setDeletingPokemonId] = React.useState<number>();
	const onArchiveDialogCancelled = React.useCallback(() => setDeletingPokemonId(undefined), []);
	const onArchiveDialogConfirmed = React.useCallback(() => {
		setDeletingPokemonId(undefined);
	}, []);

	const columns = React.useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'id',
				cell: (props: any) => <Table.Cell.Default {...props} aspectSize="xs" color="neutral.600" />,
				header: 'ID',
				size: 25
			}),
			columnHelper.accessor('name', {
				id: 'name',
				cell: (props: any) => <Table.Cell.Default {...props} fontWeight="bold" />,
				header: 'Name'
			}),
			columnHelper.accessor('url', {
				id: 'url',
				cell: (props: TableCellProps<ListPokemon>) => (
					<Link to={props.getValue()} {...(props as any)}>
						<Link.Text>{props.getValue()}</Link.Text>
					</Link>
				),
				header: 'Api url'
			}),
			{
				...columnHelper.accessor('id', {
					id: 'button',
					cell: (props: TableCellProps<ListPokemon>) => (
						<Flex justifyContent="flex-end" width="100%">
							<Button
								aspectSize="s"
								onClick={() => navigate(`/pokemon/${props.getValue()}`)}
								variant="primary"
								{...(props as any)}
							>
								See pokemon
							</Button>
							<IconButton ml={3} onClick={() => removePokemon({ pokemonId: props.cell.row.original.id })}>
								<Icon icon="delete" fill="primary.700" styling="outlined" />
							</IconButton>
						</Flex>
					),
					header: ''
				}),
				getCellWidthText: () => 'See pokemon'
			},
			columnHelper.display({
				id: 'actionMenu',
				cell: (props: TableCellProps<ListPokemon>) => (
					<Popover>
						<Popover.Trigger>
							<IconButton aspectSize="l" data-testid="jobsListPageJobsActionMenuBtn">
								<Icon fill="neutral.900" icon="kebab-vertical" styling="outlined" />
							</IconButton>
						</Popover.Trigger>
						<ActionMenu
							distance={4}
							isVisible={deletingPokemonId ? false : undefined}
							placement="left-start"
							trigger="click"
						>
							<ActionMenu.Item onClick={() => navigate(`/pokemon/${props.row.original.id}`)}>
								See details
							</ActionMenu.Item>
							<ActionMenu.Item onClick={() => setDeletingPokemonId(undefined)}>Clone</ActionMenu.Item>
							<ActionMenu.Item onClick={() => setDeletingPokemonId(undefined)}>Sell</ActionMenu.Item>
							<ActionMenu.Item onClick={() => setDeletingPokemonId(+props.row.original.id)} variant="danger">
								Delete
							</ActionMenu.Item>
						</ActionMenu>
					</Popover>
				),
				header: '',
				size: 25
			})
		],
		[deletingPokemonId, navigate, removePokemon]
	);

	const tableContent = React.useMemo(() => {
		if (!data) return null;

		return (
			<Table columns={columns} data={data} pb={4}>
				<Table.Toolbar>
					<Table.TotalResults
						render={({ totalResults }) => <Text aspectSize="xs">Total pokemons: {totalResults}</Text>}
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
		<>
			<Flex id="pokemonListPage" flexDirection="column" px={{ md: 6, xs: 3 }} py={4}>
				{data ? (
					<>
						<Helmet>
							<title>Your pokemons</title>
						</Helmet>
						<Flex alignItems="center" justifyContent="space-between">
							<Title aspectSize="s">Pokemons</Title>
							<Button aspectSize="s" onClick={() => navigate('add')} variant="secondary">
								<Button.Icon icon="add" styling="outlined" />
								<Button.Text>Add pokemon</Button.Text>
							</Button>
						</Flex>
						{tableContent}
					</>
				) : (
					<PokemonsListSkeleton />
				)}
			</Flex>
			<Dialog
				confirmBtnVariant="danger"
				confirmText="Delete"
				cancelText="Cancel"
				content="You are going to delete a pokemon. Are you sure?"
				isVisible={!!deletingPokemonId}
				onCancel={onArchiveDialogCancelled}
				onConfirm={onArchiveDialogConfirmed}
				titleText="Remove a pokemon"
			/>
		</>
	);
};

export default React.memo(PokemonItemList);
