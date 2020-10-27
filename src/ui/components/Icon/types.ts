import { IconProps } from '@material-ui/core/Icon';

import icons from './icons';

export type ComponentProps = IconProps & {
	/**
   * The icon name
   */
	icon: keyof typeof icons
};
