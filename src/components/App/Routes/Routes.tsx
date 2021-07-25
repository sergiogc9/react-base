import React from 'react';
import { useRoutes } from 'react-router-dom';

import privateRoutes from 'config/routes/private';
import publicRoutes from 'config/routes/public';

const Routes: React.FC = () => {
	const routes = [...privateRoutes, ...publicRoutes];
	return useRoutes(routes);
};

export default React.memo(Routes);
