import { BaseAnimationProps } from '@sergiogc9/react-ui';

import BaseFilter from '../../Factory/filters/BaseFilter';

export type FilterChipsChipProps = {
	animateAtMount?: BaseAnimationProps['animateAtMount']; // Needed for AnimationList in FiltersChips
	filter: BaseFilter;
	isChipEditing: boolean;
	isVisible?: BaseAnimationProps['isVisible']; // Needed for AnimationList in FiltersChips
	onChipClick: () => void;
	onClosePopover: () => void;
	onChipCloseClick: () => void;
};
