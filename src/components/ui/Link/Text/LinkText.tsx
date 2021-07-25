import React from 'react';
import { Link as LinkUI } from '@sergiogc9/react-ui';

import { LinkTextProps } from './types';

const LinkText: React.FC<LinkTextProps> = props => {
	return <LinkUI as="span" {...props} />;
};

export default React.memo(LinkText);
