import React from 'react';
import { useDispatch } from 'react-redux';
import { GoogleMapsAutocomplete, GoogleMapsAutocompleteProps } from '@sergiogc9/react-ui';

import { actions as notificationActions } from 'store/notifications';

const AppGoogleMapsAutocomplete: React.FC<GoogleMapsAutocompleteProps> = ({ onApiError, ...rest }) => {
	const dispatch = useDispatch();

	const onMapsApiError = React.useCallback(() => {
		if (onApiError) onApiError();
		dispatch(
			notificationActions.addNotification({
				level: 'error',
				t: 'api.google_maps_api_error'
			})
		);
	}, [dispatch, onApiError]);

	return <GoogleMapsAutocomplete onApiError={onMapsApiError} {...rest} />;
};

export default React.memo(AppGoogleMapsAutocomplete);
