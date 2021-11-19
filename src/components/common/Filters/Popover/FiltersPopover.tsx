import React from 'react';
import { useTranslation } from 'react-i18next';
import { Animation, Box, Button, Divider, Icon, IconButton, Popover, Select, Title } from '@sergiogc9/react-ui';

import Responsive from 'components/common/Responsive';
import useBackdrop from 'lib/hooks/useBackdrop';
import useUpdateEffect from 'lib/hooks/useUpdateEffect';

import FiltersContext from '../Context';
import FiltersFactory from '../Factory';
import { FilterField } from '..';
import { FiltersPopoverProps, FiltersPopoverContentProps } from './types';
import Form from 'components/common/Form';

const FiltersPopoverContent: React.FC<FiltersPopoverContentProps> = props => {
	const { editFilterId, onClose } = props;

	const { t } = useTranslation();

	const { addFilter, filters, fields, updateFilter } = React.useContext(FiltersContext);

	const selectedFilter = React.useMemo(() => filters.find(filter => filter.id === editFilterId), [
		editFilterId,
		filters
	]);

	const [field, setField] = React.useState<FilterField>(() =>
		editFilterId === 'new' ? fields[0] : fields.find(field => field.field === selectedFilter?.field)!
	);

	const filterInstance = React.useMemo(
		() =>
			editFilterId === 'new' || !selectedFilter
				? FiltersFactory.getFilter(field)
				: FiltersFactory.getFilter(selectedFilter),
		[editFilterId, field, selectedFilter]
	);

	const buttonsContent = React.useMemo(
		() => (
			<Box flexDirection="column">
				<Divider my={4} />
				<Box flexDirection={{ xs: 'column-reverse', md: 'row-reverse', lg: 'row' }}>
					<Form.ButtonSubmit
						aspectSize="l"
						flexBasis={{ xs: '100%', md: '50%' }}
						ml={{ xs: 0, md: 2, lg: 0 }}
						mr={{ xs: 0, lg: 2 }}
					>
						{editFilterId === 'new' ? t('form.button.add') : t('form.button.save')}
					</Form.ButtonSubmit>
					<Button
						aspectSize="l"
						flexBasis={{ xs: '100%', md: '50%' }}
						ml={{ xs: 0, lg: 2 }}
						mr={{ xs: 0, md: 2, lg: 0 }}
						mb={{ xs: 3, md: 0 }}
						onClick={onClose}
						variant="secondary"
					>
						{t('form.button.cancel')}
					</Button>
				</Box>
			</Box>
		),
		[editFilterId, onClose, t]
	);

	return (
		<>
			{editFilterId === 'new' && (
				<Select
					data-testid="filtersPopoverFieldsSelect"
					label={t('filters.popover.add.field_label')}
					mb={4}
					onOptionChange={option => setField(fields.find(field => field.field === option)!)}
					value={field.field}
				>
					{fields.map(field => (
						<Select.Option id={field.field} key={field.field}>
							{field.text}
						</Select.Option>
					))}
				</Select>
			)}
			<filterInstance.Form
				defaultValues={filterInstance.getFilterData()}
				filter={filterInstance.getFilterData()}
				onSubmit={(data: any) => {
					if (editFilterId === 'new') addFilter({ ...data, field: field.field, type: field.type });
					else updateFilter({ ...data, field: field.field, type: field.type });
					if (onClose) onClose();
				}}
			>
				{buttonsContent}
			</filterInstance.Form>
		</>
	);
};

const FiltersPopover: React.FC<FiltersPopoverProps> = React.forwardRef(
	({ editFilterId, isVisible, onClose, ...rest }, ref) => {
		const { t } = useTranslation();

		const [isPopoverContentVisible, setIsPopoverContentVisible] = React.useState(!!isVisible);

		const { containerRef } = React.useContext(FiltersContext);

		const backdropContent = useBackdrop(!!isVisible, {}, containerRef);

		const content = React.useMemo(() => {
			if (isPopoverContentVisible) return <FiltersPopoverContent editFilterId={editFilterId} onClose={onClose} />;

			return null;
		}, [editFilterId, isPopoverContentVisible, onClose]);

		const onAnimationEnded = React.useCallback(() => {
			if (isPopoverContentVisible && !isVisible) setIsPopoverContentVisible(false);
		}, [isPopoverContentVisible, isVisible]);

		useUpdateEffect(() => {
			if (isVisible) setIsPopoverContentVisible(true);
		}, [isVisible]);

		return (
			<>
				<Responsive visibility={['md', 'lg', 'xl']}>
					<Popover.Content
						borderRadius={2}
						boxShadow="center3"
						data-testid="filtersPopover"
						flexDirection="column"
						height="auto"
						isBlur
						isInteractive
						isVisible={isVisible}
						paddingX={4}
						paddingY={4}
						placement="bottom-end"
						ref={ref}
						trigger="click"
						width={368}
						{...rest}
						tippyProps={{
							...rest.tippyProps,
							appendTo: containerRef.current!,
							onHidden: onAnimationEnded,
							onClickOutside: onClose
						}}
					>
						{content}
					</Popover.Content>
					{backdropContent}
				</Responsive>
				<Responsive visibility={['xs', 'sm']}>
					<Animation.FadeIn
						bg="neutral.0"
						data-testid="filtersPopoverMobile"
						duration="0.25s"
						flexDirection="column"
						height="100%"
						isVisible={isVisible}
						left={0}
						onAnimationEnd={onAnimationEnded}
						overflowY="auto"
						p={3}
						position="fixed"
						ref={ref}
						top={0}
						width="100vw"
						zIndex={4}
					>
						<Box alignItems="center">
							<Title aspectSize="s" color="neutral.900">
								{editFilterId === 'new' ? t('filters.popover.add.title') : t('filters.popover.edit.title')}
							</Title>
							<IconButton aspectSize="l" data-testid="filtersPopoverMobileCloseBtn" ml="auto" onClick={onClose}>
								<Icon aspectSize="l" styling="outlined" icon="close" />
							</IconButton>
						</Box>
						<Box flexGrow={1} flexDirection="column" mt={4}>
							{content}
						</Box>
					</Animation.FadeIn>
				</Responsive>
			</>
		);
	}
);

export default React.memo(FiltersPopover);
