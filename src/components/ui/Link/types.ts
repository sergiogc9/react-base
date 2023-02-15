import { FlexProps } from '@sergiogc9/react-ui';

type Props = {
	/**
	 * When true, clicking the link will replace the current entry in the history stack instead of adding a new one.
	 */
	readonly replace?: boolean;
	/**
	 * A string representation of the Link location, created by concatenating the location’s pathname, search, and hash properties.
	 */
	readonly to: string;
};

export type LinkProps = Props & Omit<FlexProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>, 'href'>;
export type LinkBoxProps = FlexProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
