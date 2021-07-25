import React from 'react';

import HoverContext from 'components/ui/Hover/Context';
import { StyledHoverContent, StyledHoverContentOverlay, StyledHoverContentWrapper } from './styled';
import { HoverContentProps } from './types';

const TooltipContent: React.FC<HoverContentProps> = ({ bg, borderRadius, children, opacity, ...rest }) => {
	const { isHover, onHoverChanged } = React.useContext(HoverContext);

	return (
		<StyledHoverContentWrapper borderRadius={borderRadius} isHover={isHover}>
			<StyledHoverContentOverlay bg={bg} opacity={opacity} />
			<StyledHoverContent
				{...rest}
				onMouseEnter={() => onHoverChanged(true)}
				onMouseLeave={() => onHoverChanged(false)}
			>
				{children}
			</StyledHoverContent>
		</StyledHoverContentWrapper>
	);
};

export default React.memo(TooltipContent);
