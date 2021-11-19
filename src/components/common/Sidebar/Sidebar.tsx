import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Icon, Tooltip } from '@sergiogc9/react-ui';

import { ReactComponent as PokeBallLogo } from 'assets/logos/poke-ball.svg';
import Responsive from 'components/common/Responsive';
import Link from 'components/ui/Link';

import StyledSidebar, { StyledSidebarItem } from './styled';
import { MenuItem, SidebarProps } from './types';

const isItemSelected = (item: MenuItem, pathname: string) => {
	return pathname === item.url || (pathname !== '/' && item.url !== '/' && !!pathname.match(`^${item.url}.*`));
};

const Sidebar: React.FC<SidebarProps> = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const onLogoClicked = React.useCallback(() => navigate('/'), [navigate]);

	const sidebarNavItems = React.useMemo<MenuItem[]>(
		() => [
			{ label: 'Home', icon: 'home', iconStyling: 'outlined', url: '/' },
			{
				label: 'Pokemons',
				icon: 'users',
				iconStyling: 'outlined',
				url: '/pokemon'
			}
		],
		[]
	);

	const sidebarExtraItems = React.useMemo<MenuItem[]>(
		() => [{ label: 'Help', icon: 'help', iconStyling: 'outlined', url: '/' }],
		[]
	);

	return (
		<StyledSidebar>
			<Responsive visibility={['md', 'lg', 'xl']}>
				<Box data-testid="logo-wrapper" mb={6} mt={3}>
					<PokeBallLogo cursor="pointer" height={32} id="sidebarSquareLogo" onClick={onLogoClicked} width={32} />
				</Box>
			</Responsive>
			{sidebarNavItems.map(item => (
				<Tooltip key={item.label}>
					<StyledSidebarItem isSelected={isItemSelected(item, location.pathname)}>
						<Link alignItems="center" justifyContent="center" to={item.url} width="100%">
							<Icon fill="neutral.0" icon={item.icon} styling={item.iconStyling} />
						</Link>
					</StyledSidebarItem>
					<Tooltip.Content
						distance={10}
						duration={100}
						enterDelay={500}
						exitDelay={0}
						placement="auto"
						touch={['hold', 500]}
					>
						{item.label}
					</Tooltip.Content>
				</Tooltip>
			))}
			<Responsive visibility={['md', 'lg', 'xl']}>
				{sidebarExtraItems.map((item, index) => (
					<Tooltip key={item.label}>
						<StyledSidebarItem isSelected={isItemSelected(item, location.pathname)} mt={index === 0 ? 'auto' : 2}>
							<Link alignItems="center" justifyContent="center" to={item.url} width="100%">
								<Icon fill="neutral.0" icon={item.icon} styling={item.iconStyling} />
							</Link>
						</StyledSidebarItem>
						<Tooltip.Content
							distance={10}
							duration={100}
							enterDelay={500}
							exitDelay={0}
							placement="auto"
							touch={['hold', 500]}
						>
							{item.label}
						</Tooltip.Content>
					</Tooltip>
				))}
			</Responsive>
		</StyledSidebar>
	);
};

export default React.memo(Sidebar);
