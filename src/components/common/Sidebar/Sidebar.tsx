import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon, Text } from '@sergiogc9/react-ui';
import { Responsive, useScreenSize } from '@sergiogc9/react-ui-utils';
import { useSelector } from 'react-redux';

import uiSelectors from 'store/ui/selectors';

import StyledSidebar, { StyledSidebarItem } from './styled';
import { MenuItem, SidebarProps } from './types';

const isItemSelected = (item: MenuItem, pathname: string) => {
	return pathname === item.url || (pathname !== '/' && item.url !== '/' && !!pathname.match(`^${item.url}.*`));
};

const Sidebar: React.FC<SidebarProps> = () => {
	const location = useLocation();

	const navigate = useNavigate();

	const isPageFullScrolled = useSelector(uiSelectors.getIsPageFullScrolled);

	const { isDesktop, isMobile, screenWidth } = useScreenSize();

	const sidebarRef = React.useRef<HTMLElement>(null);

	const [hoverElementIndex, setHoverElementIndex] = React.useState<number>();

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

	const selectedItemIndex = React.useMemo(() => {
		const topIndex = sidebarNavItems.findIndex(item => isItemSelected(item, location.pathname));
		if (topIndex !== -1) return topIndex;

		const bottomIndex = sidebarExtraItems.findIndex(item => isItemSelected(item, location.pathname));
		if (bottomIndex !== -1) return bottomIndex;
	}, [location.pathname, sidebarExtraItems, sidebarNavItems]);

	return (
		<StyledSidebar
			data-testid="sidebar"
			isDesktop={isDesktop}
			isPageFullScrolled={isPageFullScrolled}
			numberOfItems={isMobile ? sidebarNavItems.length : sidebarNavItems.length + sidebarExtraItems.length}
			ref={sidebarRef}
			screenWidth={screenWidth}
			selectedIndex={hoverElementIndex ?? selectedItemIndex}
		>
			{sidebarNavItems.map((item, index) => (
				<StyledSidebarItem
					flexBasis={{ xs: 0, lg: 'unset' }}
					isSelected={selectedItemIndex === index}
					key={item.label}
					onClick={() => navigate(item.url)}
					onMouseEnter={() => setHoverElementIndex(index)}
					onMouseLeave={() => setHoverElementIndex(undefined)}
				>
					<Icon icon={item.icon} styling={item.iconStyling} />
					<Text aspectSize="xs" mt={{ xs: 0, lg: 1 }} overflow="hidden" textAlign="center" width="100%">
						{item.label}
					</Text>
				</StyledSidebarItem>
			))}
			<Responsive visibility={['md', 'lg', 'xl']}>
				{sidebarExtraItems.map((item, index) => (
					<StyledSidebarItem
						flexBasis={{ xs: 0, lg: 'unset' }}
						isSelected={isItemSelected(item, location.pathname)}
						key={item.label}
						mt={index === 0 ? 'auto' : undefined}
						onClick={() => navigate(item.url)}
						onMouseEnter={() =>
							setHoverElementIndex(isDesktop ? -1 * (sidebarExtraItems.length - index) : sidebarNavItems.length + index)
						}
						onMouseLeave={() => setHoverElementIndex(undefined)}
					>
						<Icon icon={item.icon} styling={item.iconStyling} />
						<Text aspectSize="xs" mt={{ xs: 0, lg: 1 }} overflow="hidden" textAlign="center" width="100%">
							{item.label}
						</Text>
					</StyledSidebarItem>
				))}
			</Responsive>
		</StyledSidebar>
	);
};

export default React.memo(Sidebar);
