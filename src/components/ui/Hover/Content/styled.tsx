import styled, { css } from 'styled-components';
import { Flex } from '@sergiogc9/react-ui';

import { HoverContentProps } from './types';

const StyledHoverContentWrapper = styled(Flex)<HoverContentProps & { isHover: boolean }>`
	height: 100%;
	left: 0;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	right: 0;
	transition: opacity 0.2s ease;
	width: 100%;

	> * {
		z-index: 1;
	}

	${props =>
		props.isHover &&
		css`
			opacity: 1;
		`}
`;

const StyledHoverContentOverlay = styled(Flex)<HoverContentProps>`
	height: 100%;
	position: absolute;
	width: 100%;
`;

StyledHoverContentOverlay.defaultProps = {
	bg: 'primary.800',
	opacity: 0.8
};

const StyledHoverContent = styled(Flex)<HoverContentProps>`
	border-radius: inherit;
	height: 100%;
	width: 100%;
`;

StyledHoverContent.defaultProps = {
	alignItems: 'center',
	color: 'neutral.0',
	cursor: 'pointer',
	justifyContent: 'center'
};

export { StyledHoverContent, StyledHoverContentOverlay, StyledHoverContentWrapper };
