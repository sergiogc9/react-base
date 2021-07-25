import { BoxProps } from '@sergiogc9/react-ui';

type Props = {
	/**
	 * Choose the gradient location.
	 */
	readonly location?: 'bottom' | 'left' | 'right' | 'top';
};

type TableContentGradientProps = BoxProps & Props;

export default TableContentGradientProps;
