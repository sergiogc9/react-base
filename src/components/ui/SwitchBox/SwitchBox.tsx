import React from 'react';
import { Switch } from '@sergiogc9/react-ui';

import StyledSwitchBoxWrapper from './styled';
import { SwitchBoxProps } from './types';

const SwitchBox: React.FC<SwitchBoxProps> = ({
	children,
	isChecked,
	isDefaultChecked,
	isDisabled,
	onChange,
	...rest
}) => {
	return (
		<StyledSwitchBoxWrapper {...rest}>
			{children}
			<Switch
				data-testid="switchBox-switch"
				isChecked={isChecked}
				isDisabled={isDisabled}
				isDefaultChecked={isDefaultChecked}
				marginLeft="auto"
				onChange={onChange}
			/>
		</StyledSwitchBoxWrapper>
	);
};

export default React.memo(SwitchBox);
