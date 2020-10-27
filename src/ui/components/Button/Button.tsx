import React from 'react';
import StyledButton from './Button.styled';

import { ComponentProps } from './types';

const Button: React.FC<ComponentProps> = props => {
	return <StyledButton {...props} color='inherit' />;
};

export default Button;
