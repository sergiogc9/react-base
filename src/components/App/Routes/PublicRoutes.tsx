import React from 'react';
import { useRoutes } from 'react-router-dom';

import publicRoutes from 'config/routes/public';

// Component to mount public (non authenticated) routes
const PublicRoutes: React.FC = () => {
	return useRoutes(publicRoutes);
};

export default PublicRoutes;
