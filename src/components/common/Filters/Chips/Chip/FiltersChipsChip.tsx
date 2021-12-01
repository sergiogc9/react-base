import React from 'react';
import { Animation, Chip, Popover } from '@sergiogc9/react-ui';
import { useTranslation } from 'react-i18next';

import FiltersPopover from '../../Popover';
import { FilterChipsChipProps } from './types';
import { filterChipAnimation } from './styled';

const FilterChipsChip: React.FC<FilterChipsChipProps> = ({
	animateAtMount,
	filter,
	isChipEditing,
	isVisible,
	onChipClick,
	onChipCloseClick,
	onClosePopover
}) => {
	const [isPopoverMounted, setIsPopoverMounted] = React.useState(isChipEditing);

	const { t } = useTranslation();

	const tippyProps = React.useMemo(
		() => ({
			onHidden: () => {
				setIsPopoverMounted(false);
			},
			onShow: () => {
				setIsPopoverMounted(true);
			}
		}),
		[]
	);

	return (
		<Popover>
			<Popover.Trigger>
				<Animation.BaseAnimation
					animateAtMount={animateAtMount}
					animation={filterChipAnimation}
					data-testid="filtersChipsChipAnimatedWrapper"
					duration="0.3s"
					flexShrink={0}
					isVisible={isVisible}
					maxWidth={300}
					overflow="hidden"
					timingFunction="ease-in-out"
					zIndex={isPopoverMounted ? 1 : 'unset'}
				>
					<Chip
						aspectSize="m"
						cursor="pointer"
						data-testid="filtersChipsChip"
						isOverlayAlwaysVisible={isChipEditing}
						maxWidth={300}
						mr={3}
						onClick={onChipClick}
						overlayContent={t('form.buttons.edit')}
						variant="green"
					>
						<Chip.Label>{filter.renderChipText()}</Chip.Label>
						<Chip.Icon icon="close" onClick={onChipCloseClick} styling="outlined" />
					</Chip>
				</Animation.BaseAnimation>
			</Popover.Trigger>
			<FiltersPopover
				editFilterId={filter.getFilterData().id}
				isVisible={isChipEditing}
				onClose={onClosePopover}
				placement="bottom"
				tippyProps={tippyProps}
			/>
		</Popover>
	);
};

export default FilterChipsChip;
