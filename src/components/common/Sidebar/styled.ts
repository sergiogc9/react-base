import styled, { css } from 'styled-components';
import systemCSS from '@styled-system/css';
import { Box } from '@sergiogc9/react-ui';

import { StyledSidebarItemProps, StyledSidebarProps } from './types';

const __getHoverBackgroundElementTopPosition = (selectedIndex?: number) => {
	if (selectedIndex === undefined) return -99999;

	if (selectedIndex >= 0) return `${13 + (60 + 8) * selectedIndex}px`;
	return `calc(100% - ${14 + (60 + 8) * (-1 * selectedIndex)}px)`;
};

const __getHoverBackgroundElementLeftPosition = (elementWidth: number, selectedIndex?: number) => {
	if (selectedIndex === undefined) return -99999;

	return `${8 + (elementWidth + 16) * selectedIndex}px`;
};

const StyledSidebar: React.FC<StyledSidebarProps> = styled(Box)<StyledSidebarProps>`
	${props =>
		systemCSS({
			boxShadow: props.isDesktop || props.isPageFullScrolled ? 'none' : 'up'
		})}

	&:before {
		content: '';
		${props => {
			const elementWidth = (props.screenWidth - 16 - (props.numberOfItems - 1) * 16) / props.numberOfItems;

			return systemCSS({
				bg: 'primary.800',
				borderRadius: 1,
				height: props.isDesktop ? 60 : 'calc(100% - 8px)',
				left: props.isDesktop ? 2 : __getHoverBackgroundElementLeftPosition(elementWidth, props.selectedIndex),
				opacity: props.selectedIndex !== undefined ? 1 : 0,
				position: 'absolute',
				top: props.isDesktop ? __getHoverBackgroundElementTopPosition(props.selectedIndex) : '4px',
				transition:
					props.selectedIndex !== undefined
						? 'top 0.15s ease, left 0.15s ease, opacity 0.15s ease 0.15s'
						: 'top 0.15s ease 0.15s, left 0.15s ease 0.15s, opacity 0.15s ease',
				width: props.isDesktop ? 74 : elementWidth
			});
		}}
	}
`;

StyledSidebar.defaultProps = {
	alignItems: 'center',
	bg: 'primary.700',
	flexDirection: { xs: 'row', lg: 'column' },
	height: { xs: 'auto', lg: '100%' },
	justifyContent: { xs: 'space-evenly', lg: 'flex-start' },
	overflow: 'hidden',
	px: { xs: 0, lg: 2 },
	pb: { xs: 1, lg: 3 },
	pt: { xs: 1, lg: '10px' },
	transition: 'box-shadow 0.15s ease-in-out',
	width: { xs: '100%', lg: 90 }
};

const getSelectedItemCss = () => css`
	opacity: 1;
	transition: opacity 0.15s ease-in-out 0.15s;
`;

const StyledSidebarItem = styled(Box)<StyledSidebarItemProps>`
	& {
		transition: opacity 0.15s ease-in-out;
	}

	@media (hover: hover) {
		&:hover {
			${getSelectedItemCss()}
		}
	}

	${props => props.isSelected && getSelectedItemCss()}
`;

StyledSidebarItem.defaultProps = {
	alignItems: 'center',
	color: 'neutral.0',
	cursor: 'pointer',
	flexDirection: 'column',
	flexGrow: { xs: 1, lg: 'unset' },
	height: { xs: '100%', lg: 68 },
	justifyContent: 'center',
	minHeight: { xs: '100%', lg: 68 },
	opacity: 0.6,
	overflow: 'hidden',
	px: { xs: 3, lg: 1 },
	py: { xs: '1px', lg: 1 },
	width: { xs: 'unset', lg: '100%' }
};

export { StyledSidebarItem };
export default StyledSidebar;
