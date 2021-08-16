import React from 'react';
import { useController } from 'react-hook-form';
import { SwitchBox } from '@sergiogc9/react-ui-collections';

import { FormSwitchBoxProps } from './types';

const FormSwitchBox: React.FC<FormSwitchBoxProps> = props => {
	const { name, ...rest } = props;

	const { field } = useController({ name });

	const onSwitchChanged = React.useCallback(
		(isSwitchChecked: boolean) => {
			field.onChange(isSwitchChecked);
			field.onBlur();
		},
		[field]
	);

	return <SwitchBox {...rest} isDefaultChecked={field.value} onChange={onSwitchChanged} />;
};

export default React.memo(FormSwitchBox);
