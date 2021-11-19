import React from 'react';
import { Navigate } from 'react-router-dom';
import { lazyLoadComponent } from '@sergiogc9/react-utils';

import { RoutesObject } from 'types/routes';
import withAuth from 'components/hoc/withAuth';
import withErrorBoundary from 'components/hoc/withErrorBoundary';

// Layouts
import MainLayout from 'components/layouts/Main/MainLayout';

// Pages
const MainPage = lazyLoadComponent(() => import('components/pages/Main'));
const PokemonListPage = lazyLoadComponent(() => import('components/pages/Pokemon/List'));
const PokemonAddPage = lazyLoadComponent(() => import('components/pages/Pokemon/Add'));
const PokemonItemPage = lazyLoadComponent(() => import('components/pages/Pokemon/Item'));

// Error bounded pages
const ErrorBoundedMainPage = withErrorBoundary(MainPage);
const ErrorBoundedPokemonListPage = withErrorBoundary(PokemonListPage);
const ErrorBoundedPokemonAddPage = withErrorBoundary(PokemonAddPage);
const ErrorBoundedPokemonItemPage = withErrorBoundary(PokemonItemPage);

// Authenticated Layouts
const AuthMainLayout = withAuth(MainLayout);

const privateRoutes: RoutesObject = [
	{
		path: '/',
		element: <AuthMainLayout />,
		children: [{ path: '/', element: <ErrorBoundedMainPage /> }]
	},
	{
		path: 'pokemon',
		element: <AuthMainLayout />,
		children: [
			{ index: true, element: <ErrorBoundedPokemonListPage /> },
			{ path: 'add', element: <ErrorBoundedPokemonAddPage /> },
			{ path: ':id', element: <ErrorBoundedPokemonItemPage /> },
			{ path: '*', element: <Navigate to="/pokemon" replace /> }
		]
	}
];

export default privateRoutes;
