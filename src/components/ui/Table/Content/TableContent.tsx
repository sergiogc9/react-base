import React from 'react';
import { Box, Divider } from '@sergiogc9/react-ui';
import { useIsHorizontalScrolled } from '@sergiogc9/react-hooks';

import TableContext from '../Context';
import TableBodyCell from '../Body/Cell';
import TableBodyRow from '../Body/Row';
import TableHeaderGroup from '../Header/Group';
import TableContentGradient from './Gradient';
import StyledContentTable from './styled';
import { TableContentProps } from './types';

const TableContent: React.FC<TableContentProps> = (props: TableContentProps) => {
	const { minWidth, ...rest } = props;

	const {
		tableInstance: { headerGroups, getTableBodyProps, getTableProps, page, prepareRow }
	} = React.useContext(TableContext);

	const scrollContentRef = React.useRef(null);
	const { hasScroll, percentage } = useIsHorizontalScrolled(scrollContentRef);

	const roundedPercentage = Math.round(percentage);

	return (
		<Box position="relative">
			<StyledContentTable {...rest} {...getTableProps()} ref={scrollContentRef}>
				<Box alignItems="center" flexDirection="column" minWidth={minWidth}>
					{headerGroups.map(headerGroup => (
						// eslint-disable-next-line react/jsx-key
						<TableHeaderGroup {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => {
								return column.render('Header', column.getHeaderProps());
							})}
						</TableHeaderGroup>
					))}
				</Box>
				<Box {...getTableBodyProps()} alignItems="center" flexDirection="column" minWidth={minWidth}>
					{page.map(row => {
						prepareRow(row);
						return (
							<React.Fragment key={row.getRowProps().key}>
								<TableBodyRow {...row.getRowProps()}>
									{row.cells.map(cell => (
										// eslint-disable-next-line react/jsx-key
										<TableBodyCell {...cell.getCellProps()}>{cell.render('Cell')}</TableBodyCell>
									))}
								</TableBodyRow>
								<Divider paddingX={2} />
							</React.Fragment>
						);
					})}
				</Box>
			</StyledContentTable>
			{hasScroll && (
				<TableContentGradient
					data-testId="gradient-left"
					duration="1s"
					isVisible={roundedPercentage !== 0}
					location="left"
				/>
			)}
			{hasScroll && (
				<TableContentGradient
					data-testId="gradient-right"
					duration="1s"
					isVisible={roundedPercentage !== 100}
					location="right"
				/>
			)}
		</Box>
	);
};

export default React.memo(TableContent);
