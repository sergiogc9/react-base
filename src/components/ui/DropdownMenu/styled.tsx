import React from 'react';
import styled from 'styled-components';

import { Popover } from '@sergiogc9/react-ui';
import { DropdownMenuProps } from './types';

const DropdownMenu: React.FC<DropdownMenuProps> = styled(Popover.Content)``;

DropdownMenu.defaultProps = {
	boxShadow: 'up',
	flexDirection: 'column',
	height: 'auto',
	paddingX: 0,
	paddingY: 0
};

export default React.memo(DropdownMenu);
