import React from 'react';
import { Box } from '@sergiogc9/react-ui';

import HoverContext from 'components/ui/Hover/Context';
import { HoverContextData } from 'components/ui/Hover/Context/types';
import { HoverProps } from './types';

const Hover: React.FC<HoverProps> = props => {
	const [isHover, setIsHover] = React.useState(false);

	const contextData: HoverContextData = {
		isHover,
		onHoverChanged: hover => setIsHover(hover)
	};

	return (
		<HoverContext.Provider value={contextData}>
			<Box height="min-content" position="relative" width="min-content" {...props} />
		</HoverContext.Provider>
	);
};

export default React.memo(Hover);
