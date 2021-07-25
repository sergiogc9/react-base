import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';

import { TableToolbarProps } from './types';

const TableToolbar: React.FC<TableToolbarProps> = styled(Box)<TableToolbarProps>``;

TableToolbar.defaultProps = {
	alignItems: 'center',
	minHeight: 50,
	width: '100%'
};

export default TableToolbar;
