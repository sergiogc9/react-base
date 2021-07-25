import React from 'react';
import { Box, Spinner } from '@sergiogc9/react-ui';

import { LoadingProps } from './types';

const Loading: React.FC<LoadingProps> = props => {
	return (
		<Box
			alignItems="center"
			color="primary.500"
			height="100%"
			justifyContent="center"
			minHeight="100px"
			data-testid="loading"
			width="100%"
			{...props}
		>
			<Spinner>
				{[1, 2, 3].map(index => (
					<Spinner.Pulse key={index} index={index} mx="2.5px" size="8px" />
				))}
			</Spinner>
		</Box>
	);
};

export default React.memo(Loading);
