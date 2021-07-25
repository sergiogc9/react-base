import React from 'react';
import { Button } from '@sergiogc9/react-ui';

import useOnLinkNavigate from 'lib/hooks/useOnLinkNavigate';
import { LinkButtonProps } from './types';

const LinkButton: React.FC<LinkButtonProps> = props => {
	const { onClick, replace, to, ...rest } = props;

	const onLinkClicked = useOnLinkNavigate({ onClick, replace, to });

	return <Button {...rest} onClick={onLinkClicked} variant="link" />;
};

export default React.memo(LinkButton);
