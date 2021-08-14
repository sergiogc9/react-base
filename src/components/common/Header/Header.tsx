import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@sergiogc9/react-ui';

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
		<StyledHeader className={isPageScrolled ? 'with-border' : ''} data-testid="header-wrapper">
			<Responsive visibility={['xs', 'sm']}>
				<Box id="headerLogo" ml="20px" mr="auto" onClick={onLogoClicked} width="30px">
					<PokeBallLogo />
				</Box>
			</Responsive>
			<HeaderProfile />
			<HeaderFullscreen />
		</StyledHeader>
	);
};

export default React.memo(Header);
