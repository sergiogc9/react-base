import { Flex } from '@sergiogc9/react-ui';

import styled from 'styled-components';

const StyledHeader = styled(Flex)``;

StyledHeader.defaultProps = {
	alignItems: 'center',
	as: 'header',
	paddingX: { xs: 3, md: 4 },
	transition: 'box-shadow 0.15s ease-in-out',
	width: '100%',
	zIndex: 1
};

export default StyledHeader;
