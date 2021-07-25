import React from 'react';
import { Navigate } from 'react-router-dom';

import { RoutesObject } from 'types/routes';

const publicRoutes: RoutesObject = [
	{ path: '/public', element: <Navigate to="/" replace /> },
	{
		// TODO! check this in private routes
		path: '*',
		element: <Navigate to="/" replace />
	}
];

export default publicRoutes;
