import React from 'react';
import styled from 'styled-components';
import { Box } from '@sergiogc9/react-ui';

import { StyledFormProps } from './types';

const StyledForm: React.FC<StyledFormProps> = styled(Box)<StyledFormProps>``;

StyledForm.defaultProps = {
	as: 'form',
	display: 'block',
	width: '100%'
};

export default React.memo(StyledForm);
