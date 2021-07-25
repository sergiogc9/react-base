import React from 'react';
import useScreenSize from 'lib/hooks/useScreenSize';

import { ComponentProps } from './types';

const Responsive: React.FC<ComponentProps> = props => {
	const { children, visibility } = props;

	const size = useScreenSize();

	if (visibility.includes(size)) return <>{children}</>;
	return null;
};

export default React.memo(Responsive);
