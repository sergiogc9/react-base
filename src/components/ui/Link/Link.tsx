import React from 'react';
import { Box } from '@sergiogc9/react-ui';

import useOnLinkNavigate from 'lib/hooks/useOnLinkNavigate';
import { LinkProps, LinkBoxProps } from './types';

const LinkBox = Box as React.FC<LinkBoxProps>;

const Link: React.FC<LinkProps> = props => {
	const { as = 'a', onClick, replace, to } = props;

	const onLinkClicked = useOnLinkNavigate({ onClick, replace, to });

	return (
		<LinkBox
			as={as}
			alignItems="center"
			cursor="pointer"
			href={as === 'a' ? to : undefined}
			onClick={onLinkClicked}
			{...props}
		/>
	);
};

export default React.memo(Link);
