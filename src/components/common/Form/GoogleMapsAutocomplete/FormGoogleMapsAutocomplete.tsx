import React from 'react';
import { useField } from 'formik';

import GoogleMapsAutocomplete from 'components/ui/GoogleMapsAutocomplete';
import { GoogleMapsPlace } from 'types/google';
import { FormGoogleMapsAutocompleteProps } from './types';

const FormGoogleMapsAutocomplete: React.FC<FormGoogleMapsAutocompleteProps> = props => {
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
		<GoogleMapsAutocomplete
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

export default React.memo(FormGoogleMapsAutocomplete);
