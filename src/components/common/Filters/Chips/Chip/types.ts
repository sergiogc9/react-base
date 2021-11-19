import { BaseAnimationProps } from '@sergiogc9/react-ui';

import { Filter } from '../..';

export type FilterChipsChipProps = {
	animateAtMount?: BaseAnimationProps['animateAtMount']; // Needed for AnimationList in FiltersChips
	filterData: Filter;
	isChipEditing: boolean;
	isVisible?: BaseAnimationProps['isVisible']; // Needed for AnimationList in FiltersChips
	onChipClick: () => void;
	onClosePopover: () => void;
	onChipCloseClick: () => void;
};
