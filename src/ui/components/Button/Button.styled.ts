import React from 'react';
import styled, {css} from 'styled-components';
import Button from '@material-ui/core/Button';

import { ComponentProps } from './types';

const StyledButton = styled<React.FC<ComponentProps>>(Button)`
	&&{
		${props => props.textColor && css`color: ${props.textColor};`}
	}
`;

export default StyledButton;
