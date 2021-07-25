import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';

const StyledSwitchBoxWrapper = styled(Box)``;

StyledSwitchBoxWrapper.defaultProps = {
	alignItems: 'center',
	borderRadius: { xs: '0px', md: 1 },
	bg: 'neutral.50',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	padding: 3,
	width: '100%'
};

export default StyledSwitchBoxWrapper;
