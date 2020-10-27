import React from 'react';

import icons from './icons';
import { ComponentProps } from './types';

const Icon: React.FC<ComponentProps> = props => {
	const IconComponent = icons[props.icon];
	return <IconComponent {...props as any} />;
};

export default Icon;
