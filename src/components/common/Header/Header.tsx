import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Flex, Divider, Image } from '@sergiogc9/react-ui';

import { ReactComponent as PokeBallLogo } from 'assets/logos/poke-ball.svg';
import uiSelectors from 'store/ui/selectors';

import Responsive from '../Responsive';
import HeaderFullscreen from './Fullscreen';
import HeaderProfile from './Profile';
import StyledHeader from './styled';

const Header: React.FC = () => {
	const isPageScrolled = useSelector(uiSelectors.getIsPageScrolled);
	const navigate = useNavigate();

	const onLogoClicked = React.useCallback(() => navigate('/'), [navigate]);

	return (
		<StyledHeader boxShadow={isPageScrolled ? 'down' : undefined} data-testid="header-wrapper">
			<Responsive visibility={['md', 'lg', 'xl']}>
				<Image data-testid="headerLogo" src="/assets/images/pokemon-logo.png" height={40} />
			</Responsive>
			<Responsive visibility={['xs', 'sm']}>
				<Flex id="headerLogo" ml="20px" mr="auto" onClick={onLogoClicked} width="30px">
					<PokeBallLogo />
				</Flex>
			</Responsive>
			<HeaderProfile />
			<HeaderFullscreen />
			<Divider
				bottom="-1px"
				left={{ xs: 0, lg: 90 }}
				opacity={isPageScrolled ? 0 : 1}
				position="absolute"
				transition="opacity 0.15s ease-in-out"
				width={{ xs: '100%', lg: 'calc(100% - 90px)' }}
			/>
		</StyledHeader>
	);
};

export default React.memo(Header);
