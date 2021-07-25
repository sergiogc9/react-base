import React from 'react';
import { Box, Title } from '@sergiogc9/react-ui';

const FallbackError: React.FC = () => {
	return (
		<Box width="100%" height="100%" justifyContent="center" alignItems="center">
			<Title>Error</Title>
		</Box>
	);
};

export default React.memo(FallbackError);
