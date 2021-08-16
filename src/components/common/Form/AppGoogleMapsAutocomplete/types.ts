import { GoogleMapsAutocompleteProps } from '@sergiogc9/react-ui';

type Props = {
	readonly name: string;
};

export type FormAppGoogleMapsAutocompleteProps = Props &
	Omit<GoogleMapsAutocompleteProps, 'defaultPlace' | 'onBlur' | 'onPlaceChange'>;
