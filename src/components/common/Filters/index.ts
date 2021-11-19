import FiltersContext, { FiltersContextData } from './Context';
import FiltersChips, { FiltersChipsProps } from './Chips';
import FiltersFactory from './Factory';
import FiltersPopover, { FiltersPopoverProps } from './Popover';
import FiltersProvider from './Provider';

export type { FiltersChipsProps, FiltersContextData, FiltersPopoverProps };
export * from './types';
export default {
	Chips: FiltersChips,
	Context: FiltersContext,
	Factory: FiltersFactory,
	Popover: FiltersPopover,
	Provider: FiltersProvider
};
