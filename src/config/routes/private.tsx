import React from 'react';
import { Navigate } from 'react-router-dom';

import { RoutesObject } from "types/routes";

// Layouts
import MainLayout from 'components/layouts/Main/MainLayout';
import PokemonLayout from 'components/layouts/Pokemon/PokemonLayout';

// Pages
import MainPage from 'components/pages/Main';
import PokemonListPage from 'components/pages/Pokemon/List';
import PokemonItemPage from 'components/pages/Pokemon/Item';

const privateRoutes: RoutesObject = [
	{
		path: '/', element: <MainLayout />, children: [
			{ path: '/', element: <MainPage /> }
		]
	},
	{
		path: 'pokemon', element: <PokemonLayout />, children: [
			{ path: '/', element: <PokemonListPage /> },
			{ path: ':id', element: <PokemonItemPage /> },
			{ path: '*', element: <Navigate to="/pokemon" replace={true} /> }
		]
	},
	{
		path: '*', element: <Navigate to="/" replace={true} />
	}
];

export default privateRoutes;
