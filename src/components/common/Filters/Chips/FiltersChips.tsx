import React from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lib/imports/lodash';
import { Animation, Button } from '@sergiogc9/react-ui';

import FiltersContext from '../Context';
import FiltersFactory from '../Factory';
import StyledFilterChips, { filterChipWrapperAnimation } from './styled';
import { FiltersChipsProps } from './types';
import FiltersChipsChip from './Chip';

const FiltersChips: React.FC<FiltersChipsProps> = props => {
	const { t } = useTranslation();

	const [editingChipId, setEditingChipId] = React.useState<string>();

	const { clearAllFilters, fields, filters, removeFilter } = React.useContext(FiltersContext);

	const chipsWrapperRef = React.useRef(null);

	const onClosePopover = React.useCallback(() => {
		setEditingChipId(undefined);
	}, []);

	const chipsContent = React.useMemo(() => {
		return filters.map(filterData => {
			const filter = FiltersFactory.getFilter(filterData, fields);

			return (
				<FiltersChipsChip
					filter={filter}
					key={filterData.id}
					isChipEditing={editingChipId === filterData.id}
					onChipClick={() => {
						if (editingChipId === undefined) setEditingChipId(filterData.id);
						else onClosePopover();
					}}
					onClosePopover={onClosePopover}
					onChipCloseClick={() => {
						setEditingChipId(undefined);
						removeFilter(filterData);
					}}
				/>
			);
		});
	}, [editingChipId, fields, filters, onClosePopover, removeFilter]);

	return (
		<StyledFilterChips
			animateAtMount={false}
			animation={filterChipWrapperAnimation}
			data-testid="filtersChipsAnimationWrapper"
			duration="0.3s"
			flexWrap={{ xs: 'nowrap', lg: 'wrap' }}
			isVisible={!isEmpty(filters)}
			overflowX={{ xs: 'auto', lg: 'visible' }}
			pt={5}
			ref={chipsWrapperRef}
			rowGap={3}
			{...props}
		>
			<Animation.List>{chipsContent}</Animation.List>
			<Animation.FadeIn animateAtMount={false} duration="0.3s" isVisible={!isEmpty(filters)} key="clearAllFiltersBtn">
				<Button
					aspectSize="s"
					data-testid="filtersChipsClearAllBtn"
					flexShrink={0}
					onClick={clearAllFilters}
					variant="subtle"
				>
					{t('filters.chips.clear_all_btn')}
				</Button>
			</Animation.FadeIn>
		</StyledFilterChips>
	);
};

export default React.memo(FiltersChips);
