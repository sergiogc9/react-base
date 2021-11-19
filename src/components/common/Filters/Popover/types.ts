import { PopoverContentProps } from '@sergiogc9/react-ui';

type Props = {
	readonly editFilterId: string | 'new';
	readonly onClose?: () => void;
};

export type FiltersPopoverProps = Props & PopoverContentProps;
export type FiltersPopoverContentProps = Props;
