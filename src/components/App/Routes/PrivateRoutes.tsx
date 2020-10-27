import React from 'react';
import { useRoutes } from 'react-router-dom';

import privateRoutes from 'config/routes/private';

// Component to mount private (authenticated) routes
// If user is not authenticated, this component should not be rendered!
const PrivateRoutes: React.FC = () => {
	return useRoutes(privateRoutes);
};

export default PrivateRoutes;
