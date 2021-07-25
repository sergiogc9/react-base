import { GoogleMapsAutocompleteProps } from 'components/ui/GoogleMapsAutocomplete/types';

type Props = {
	readonly name: string;
};

export type FormGoogleMapsAutocompleteProps = Props &
	Omit<GoogleMapsAutocompleteProps, 'defaultPlace' | 'onBlur' | 'onPlaceChange'>;
