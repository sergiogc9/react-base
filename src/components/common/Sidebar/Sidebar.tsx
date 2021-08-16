import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Icon, IconProps, Tooltip } from '@sergiogc9/react-ui';

import { ReactComponent as PokeBallLogo } from 'assets/logos/poke-ball.svg';
import Responsive from 'components/common/Responsive';

import StyledSidebar from './styled';

type MenuItem = {
	label: string;
	icon: IconProps['icon'];
	iconStyling: IconProps['styling'];
	url: string;
};

const Sidebar: React.FC = () => {
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
		<StyledSidebar className="sidebar">
			<Responsive visibility={['md', 'lg', 'xl']}>
				<Box width="100%" px="19px">
					<Box
						width="100%"
						minHeight="48px"
						justifyContent="center"
						alignItems="center"
						position="relative"
						overflow="hidden"
						cursor="pointer"
						mb="30px"
						onClick={onLogoClicked}
						data-testid="logo-wrapper"
					>
						<PokeBallLogo id="sidebarSquareLogo" />
					</Box>
				</Box>
			</Responsive>
			<Box className="sidebar-menu nav-menu" as="nav" width="100%" display="block">
				<ul>
					{sidebarNavItems.map(item => {
						const isSelected =
							location.pathname === item.url || (!!location.pathname.match(`^${item.url}`) && item.url !== '/');
						return (
							<Tooltip key={item.label}>
								<Tooltip.Trigger as="li">
									<Link to={item.url} className={isSelected ? 'selected' : ''}>
										<Box width="24px" height="24px" justifyContent="center" alignItems="center">
											<Icon styling={item.iconStyling} icon={item.icon} fill="neutral.0" />
										</Box>
									</Link>
								</Tooltip.Trigger>
								<Tooltip.Content
									distance={10}
									enterDelay={500}
									exitDelay={0}
									duration={100}
									placement="auto"
									touch={['hold', 500]}
								>
									{item.label}
								</Tooltip.Content>
							</Tooltip>
						);
					})}
				</ul>
			</Box>
			<Responsive visibility={['md', 'lg', 'xl']}>
				<Box className="sidebar-menu extra-menu" as="ul" width="100%" display="block" mt="auto" mb={4}>
					{sidebarExtraItems.map(item => {
						return (
							<Tooltip key={item.label}>
								<Tooltip.Trigger as="li">
									<Link to={item.url}>
										<Box width="24px" height="24px" justifyContent="center" alignItems="center">
											<Icon styling={item.iconStyling} icon={item.icon} fill="neutral.0" />
										</Box>
									</Link>
								</Tooltip.Trigger>
								<Tooltip.Content
									distance={10}
									enterDelay={500}
									exitDelay={0}
									duration={100}
									placement="auto"
									touch={['hold', 500]}
								>
									{item.label}
								</Tooltip.Content>
							</Tooltip>
						);
					})}
				</Box>
			</Responsive>
		</StyledSidebar>
	);
};

export default React.memo(Sidebar);
