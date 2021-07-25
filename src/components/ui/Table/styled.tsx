import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';

import { StyledTableWrapperProps } from './types';

const StyledTableWrapper: React.FC<StyledTableWrapperProps> = styled(Box)<StyledTableWrapperProps>``;

StyledTableWrapper.defaultProps = {
	flexDirection: 'column'
};

export default StyledTableWrapper;
