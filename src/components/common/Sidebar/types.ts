import { IconProps, TooltipTriggerProps } from '@sergiogc9/react-ui';

export type MenuItem = {
	icon: IconProps['icon'];
	iconStyling: IconProps['styling'];
	label: string;
	url: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type SidebarProps = {};

export type StyledSidebarItemProps = TooltipTriggerProps & {
	isSelected: boolean;
};
