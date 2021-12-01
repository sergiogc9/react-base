import { BoxProps, IconProps, TooltipTriggerProps } from '@sergiogc9/react-ui';

export type MenuItem = {
	icon: IconProps['icon'];
	iconStyling: IconProps['styling'];
	label: string;
	url: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type SidebarProps = {};
export type StyledSidebarProps = {
	isDesktop: boolean;
	isPageFullScrolled: boolean;
	numberOfItems: number;
	screenWidth: number;
	selectedIndex?: number;
} & BoxProps;

export type StyledSidebarItemProps = TooltipTriggerProps & {
	isSelected: boolean;
};
