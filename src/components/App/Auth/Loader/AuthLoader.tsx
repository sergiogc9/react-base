import React from 'react';
import { Flex } from '@sergiogc9/react-ui';

import LoadingLogo from 'components/ui/LoadingLogo';

const AuthLoader: React.FC = () => {
	return (
		<Flex alignItems="center" flexDirection="column" justifyContent="center" height="100%" width="100%">
			<LoadingLogo />
		</Flex>
	);
};

export default AuthLoader;
