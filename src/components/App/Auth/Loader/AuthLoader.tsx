import React from 'react';
import { Box } from '@sergiogc9/react-ui';

import LoadingLogo from 'components/ui/LoadingLogo';

const AuthLoader: React.FC = () => {
	return (
		<Box alignItems="center" flexDirection="column" justifyContent="center" height="100%" width="100%">
			<LoadingLogo />
		</Box>
	);
};

export default AuthLoader;
