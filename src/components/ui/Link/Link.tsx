import React from 'react';
import { Box } from '@sergiogc9/react-ui';

import useOnLinkNavigate from 'lib/hooks/useOnLinkNavigate';

import LinkText from './Text';
import { LinkProps, LinkBoxProps } from './types';

const LinkBox = Box as React.FC<LinkBoxProps>;

const Link: React.FC<LinkProps> = props => {
	const { as = 'a', children, onClick, replace, to } = props;

	const onLinkClicked = useOnLinkNavigate({ onClick, replace, to });

	return (
		<LinkBox
			as={as}
			alignItems="center"
			cursor="pointer"
			href={as === 'a' ? to : undefined}
			onClick={onLinkClicked}
			{...props}
		>
			{typeof children === 'string' || Array.isArray(children) ? <LinkText>{children}</LinkText> : children}
		</LinkBox>
	);
};

export default React.memo(Link);
