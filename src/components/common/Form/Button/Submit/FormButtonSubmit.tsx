import React from 'react';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lib/imports/lodash';
import { Button } from '@sergiogc9/react-ui';

import { FormButtonSubmitProps } from './types';

const FormButtonSubmit: React.FC<FormButtonSubmitProps> = props => {
	const { children, isDefaultEnabled, ...rest } = props;

	const { errors, isSubmitting, touched } = useFormikContext();

	const isButtonDisabled = React.useMemo(() => {
		return !isEmpty(errors) || (isEmpty(touched) && !isDefaultEnabled);
	}, [errors, isDefaultEnabled, touched]);

	return (
		<Button type="submit" {...rest} isDisabled={isButtonDisabled} isLoading={isSubmitting}>
			{children}
		</Button>
	);
};

export default React.memo(FormButtonSubmit);
