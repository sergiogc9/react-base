import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';

import { TableBodyCellProps } from './types';

const TableBodyCell: React.FC<TableBodyCellProps> = styled(Box)<TableBodyCellProps>`
	flex-shrink: 1 !important;
`;

TableBodyCell.defaultProps = {
	padding: 3
};

export default TableBodyCell;
