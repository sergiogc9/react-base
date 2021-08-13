import React from 'react';
import { Box, Image, Spinner } from '@sergiogc9/react-ui';

import { LoadingLogoProps } from './types';

const LoadingLogo: React.FC<LoadingLogoProps> = ({ children, ...rest }) => (
	<Box alignItems="center" justifyContent="center">
		<Spinner.Circle circles={3} circleSize={6} data-testid="loadingLogoSpinner" {...rest} />
		<Box padding="35%" position="absolute">
			{children ?? <Image src="/assets/images/pokeball-blue.png" height="100%" width="100%" />}
		</Box>
	</Box>
);

export default React.memo(LoadingLogo);
