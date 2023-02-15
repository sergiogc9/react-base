import React from 'react';
import { Button } from '@sergiogc9/react-ui';

import { LinkButtonTextProps } from './types';

const LinkText: React.FC<LinkButtonTextProps> = props => {
	return <Button.Text {...props} />;
};

export default React.memo(LinkText);
