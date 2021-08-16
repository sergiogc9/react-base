import React from 'react';
import { useController } from 'react-hook-form';
import { GoogleMapsPlace } from '@sergiogc9/react-ui';

import AppGoogleMapsAutocomplete from 'components/ui/AppGoogleMapsAutocomplete';
import { FormAppGoogleMapsAutocompleteProps } from './types';

const FormAppGoogleMapsAutocomplete: React.FC<FormAppGoogleMapsAutocompleteProps> = props => {
	const { helperText, name, ...rest } = props;

	const { field, fieldState } = useController({ name });

	const isError = fieldState.isTouched && fieldState.invalid;

	const onGoogleMapsBlurred = React.useCallback(() => {
		if (!fieldState.isTouched) field.onBlur();
	}, [field, fieldState.isTouched]);

	const onPlaceSelected = React.useCallback(
		(place: GoogleMapsPlace | null) => {
			field.onChange(place);
			field.onBlur();
		},
		[field]
	);

	return (
		<AppGoogleMapsAutocomplete
			{...rest}
			defaultPlace={field.value}
			helperText={isError ? fieldState.error?.message : helperText}
			isError={isError}
			name={name}
			onBlur={onGoogleMapsBlurred}
			onPlaceChange={onPlaceSelected}
		/>
	);
};

export default React.memo(FormAppGoogleMapsAutocomplete);
