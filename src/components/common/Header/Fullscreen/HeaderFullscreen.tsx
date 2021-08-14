import React from 'react';
import { Icon, IconButton } from '@sergiogc9/react-ui';
import { useFullscreen } from '@sergiogc9/react-hooks';

const HeaderFullscreen: React.FC = () => {
	const { isFullscreen, toggleFullscreen } = useFullscreen();

	const onButtonClicked = React.useCallback(() => toggleFullscreen(), [toggleFullscreen]);

	return (
		<IconButton data-testid="header-fullscreen" mr={3} onClick={onButtonClicked}>
			{isFullscreen ? (
				<Icon data-testid="fullscreen-exit-icon" icon="fullscreen-exit" styling="outlined" />
			) : (
				<Icon data-testid="fullscreen-icon" icon="fullscreen" styling="outlined" />
			)}
		</IconButton>
	);
};

export default React.memo(HeaderFullscreen);
