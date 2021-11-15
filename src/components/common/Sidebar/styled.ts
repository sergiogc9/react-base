import styled, { css } from 'styled-components';
import systemCSS from '@styled-system/css';
import { Box, Tooltip } from '@sergiogc9/react-ui';

import { StyledSidebarItemProps } from './types';

const StyledSidebar = styled(Box)``;

StyledSidebar.defaultProps = {
	alignItems: 'center',
	bg: 'primary.800',
	borderRightColor: 'neutral.500',
	borderRightStyle: 'solid',
	borderRightWidth: 'thin',
	flexDirection: { xs: 'row', md: 'column' },
	height: { xs: 'auto', md: '100vh' },
	justifyContent: { xs: 'space-evenly', md: 'flex-start' },
	pb: { xs: 0, md: 4 },
	width: { xs: '100%', md: 72 }
};

const getSelectedItemCss = () => css`
	opacity: 1;

	&:before {
		${systemCSS({
			transform: ['scaleX(1)', 'scaleX(1)', 'scaleX(1)', 'scaleY(1)'],
			transition: 'transform 0.15s ease'
		})}
	}
`;

const StyledSidebarItem = styled(Tooltip.Trigger)<StyledSidebarItemProps>`
	&::before {
		content: '';

		${systemCSS({
			bg: 'primary.500',
			borderRadius: 100,
			bottom: 0,
			height: [2, 2, 2, '100%'],
			left: 0,
			position: 'absolute',
			transform: ['scaleX(0)', 'scaleX(0)', 'scaleX(0)', 'scaleY(0)'],
			width: ['100%', '100%', '100%', 2]
		})}
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
	cursor: 'pointer',
	height: { xs: '100%', md: 40 },
	justifyContent: 'center',
	mt: { xs: 0, md: 2 },
	opacity: 0.6,
	width: { xs: 40, md: '100%' }
};

export { StyledSidebarItem };
export default StyledSidebar;
