import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';

import { TableContentProps } from './types';

const StyledTableContent: React.FC<TableContentProps> = styled(Box)<TableContentProps>`
	display: block;
`;

StyledTableContent.defaultProps = {
	overflowX: 'auto',
	width: '100%'
};

export default StyledTableContent;
