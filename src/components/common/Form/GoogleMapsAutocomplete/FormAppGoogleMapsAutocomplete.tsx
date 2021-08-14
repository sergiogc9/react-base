import React from 'react';
import { useField } from 'formik';

import AppGoogleMapsAutocomplete from 'components/ui/AppGoogleMapsAutocomplete';
import { GoogleMapsPlace } from 'types/google';
import { FormAppGoogleMapsAutocompleteProps } from './types';

const FormAppGoogleMapsAutocomplete: React.FC<FormAppGoogleMapsAutocompleteProps> = props => {
	const { helperText, name, ...rest } = props;

	const [field, meta, helpers] = useField(name);

	const isError = meta.touched && !!meta.error;

	const onPlaceSelected = React.useCallback(
		(place: GoogleMapsPlace | null) => {
			helpers.setTouched(true);
			helpers.setValue(place);
		},
		[helpers]
	);

	return (
		<AppGoogleMapsAutocomplete
			{...rest}
			defaultPlace={field.value}
			helperText={isError ? meta.error : helperText}
			isError={isError}
			name={name}
			onBlur={field.onBlur}
			onPlaceChange={onPlaceSelected}
		/>
	);
};

export default React.memo(FormAppGoogleMapsAutocomplete);
