import React from 'react';
import { Navigate } from 'react-router-dom';
import { lazyLoadComponent } from '@sergiogc9/react-utils';

import { RoutesObject } from 'types/routes';
import withAuth from 'components/hoc/withAuth';

// Layouts
import MainLayout from 'components/layouts/Main/MainLayout';

// Pages
const MainPage = lazyLoadComponent(() => import('components/pages/Main'));
const PokemonListPage = lazyLoadComponent(() => import('components/pages/Pokemon/List'));
const PokemonItemPage = lazyLoadComponent(() => import('components/pages/Pokemon/Item'));
// ProfilePage.preload();

// Authenticated Layouts
const AuthMainLayout = withAuth(MainLayout);

const privateRoutes: RoutesObject = [
	{
		path: '/',
		element: <AuthMainLayout />,
		children: [{ path: '/', element: <MainPage /> }]
	},
	{
		path: 'pokemon',
		element: <AuthMainLayout />,
		children: [
			{ path: '/', element: <PokemonListPage /> },
			{ path: ':id', element: <PokemonItemPage /> },
			{ path: '*', element: <Navigate to="/pokemon" replace /> }
		]
	}
];

export default privateRoutes;
