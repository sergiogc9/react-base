import React from 'react';
import { Animation, Box } from '@sergiogc9/react-ui';
import styled from 'styled-components';

import location from './variants/location';
import TableContentGradientProps from './types';

const StyledTableGradient: React.FC<TableContentGradientProps> = styled(Box)`
	${location}
`;

StyledTableGradient.defaultProps = { position: 'absolute' };

const AnimatedStyledTableGradient = Animation.withBaseAnimation(StyledTableGradient, Animation.FadeInAnimation);

export default AnimatedStyledTableGradient;
