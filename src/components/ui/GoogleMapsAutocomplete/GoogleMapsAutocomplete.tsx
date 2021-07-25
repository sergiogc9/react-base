import React from 'react';
import { useDispatch } from 'react-redux';
import { debounce, find, isEmpty } from 'lib/imports/lodash';
import { useIsMounted, useUpdateEffect } from '@sergiogc9/react-hooks';
import { Select, SelectProps } from '@sergiogc9/react-ui';

import { actions as notificationActions } from 'store/notifications';
import useAddMapsScript from 'lib/hooks/useAddMapsScript';

import { GoogleMapsPlace } from 'types/google';
import { GoogleMapsAutocompleteProps, MapsSearchPlace, PredictionOptions } from './types';

let autocompleteService: any;

const __getPlacePredictions = async (request: PredictionOptions) => {
	const { predictions } = await autocompleteService.getPlacePredictions(request);
	return predictions as MapsSearchPlace[];
};

const __getPlaceData = async (result: MapsSearchPlace): Promise<GoogleMapsPlace> => {
	const geoCoder = new (window as any).google.maps.Geocoder();
	const { results } = await geoCoder.geocode({ placeId: result.place_id });

	return {
		placeId: result.place_id,
		name: result.description,
		latitude: results[0].geometry.location.lat(),
		longitude: results[0].geometry.location.lng()
	};
};

const GoogleMapsAutocomplete: React.FC<GoogleMapsAutocompleteProps> = props => {
	const { countries, defaultPlace, onlyRegions, onBlur, onPlaceChange, ...rest } = props;

	const [inputValue, setInputValue] = React.useState(defaultPlace?.name || '');
	const selectedSearchPlace = React.useRef<MapsSearchPlace | null>(
		defaultPlace ? ({ place_id: defaultPlace.placeId, description: defaultPlace.name } as MapsSearchPlace) : null
	);
	const [options, setOptions] = React.useState<MapsSearchPlace[]>(() =>
		defaultPlace ? [{ description: defaultPlace.name, place_id: defaultPlace.placeId } as MapsSearchPlace] : []
	);
	const [areOptionsValid, setAreOptionsValid] = React.useState(false);

	const isMounted = useIsMounted();
	const dispatch = useDispatch();

	useAddMapsScript();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchSearchPlaces = React.useCallback(
		debounce(async (value: string) => {
			const predictionOptions: PredictionOptions = { input: value };
			if (onlyRegions) predictionOptions.types = ['(regions)'];
			if (countries) predictionOptions.componentRestrictions = { country: countries };

			try {
				const results = await __getPlacePredictions(predictionOptions);

				let newOptions = [] as MapsSearchPlace[];

				if (results) {
					newOptions = [...newOptions, ...results];
				}

				setOptions(newOptions);
			} catch (e) {
				dispatch(
					notificationActions.addNotification({
						level: 'error',
						t: 'api.google_maps_api_error'
					})
				);
			}

			setAreOptionsValid(true);
		}, 250),
		[countries, onlyRegions]
	);

	useUpdateEffect(() => {
		if (!autocompleteService && (window as any).google) {
			autocompleteService = new (window as any).google.maps.places.AutocompleteService();
		}

		if (!autocompleteService) return;

		if (isEmpty(inputValue)) {
			setOptions([]);
			return;
		}

		setAreOptionsValid(false);
		fetchSearchPlaces(inputValue);

		return () => {
			fetchSearchPlaces.cancel();
		};
	}, [countries, inputValue, onlyRegions]); // eslint-disable-line react-hooks/exhaustive-deps

	const onFetchSearchPlaceData = React.useCallback(
		async (selectedPlace: MapsSearchPlace | null) => {
			if (onPlaceChange) {
				if (!selectedPlace) return onPlaceChange(null);

				try {
					const place = await __getPlaceData(selectedPlace);
					onPlaceChange(place);
				} catch (e) {
					dispatch(
						notificationActions.addNotification({
							level: 'error',
							t: 'api.google_maps_api_error'
						})
					);
				}
			}
		},
		[dispatch, onPlaceChange]
	);

	const onSelectOptionChange = React.useCallback<NonNullable<SelectProps['onOptionChange']>>(
		placeId => {
			const selectedOption = find(options, { place_id: placeId as string }) || null;
			selectedSearchPlace.current = selectedOption;

			onFetchSearchPlaceData(selectedOption);
		},
		[onFetchSearchPlaceData, options]
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onResetSelectedOption = React.useCallback(
		debounce((currentOptions: MapsSearchPlace[]) => {
			if (
				isMounted() &&
				!(currentOptions.length === 1 && selectedSearchPlace.current?.place_id === currentOptions[0].place_id)
			)
				setOptions(selectedSearchPlace.current ? [selectedSearchPlace.current] : []);
		}, 500),
		[isMounted]
	);

	const onSelectBlurred = React.useCallback<NonNullable<SelectProps['onBlur']>>(
		ev => {
			if (onBlur) onBlur(ev);

			onResetSelectedOption(options);
		},
		[onBlur, onResetSelectedOption, options]
	);

	const selectOptions = React.useMemo(
		() =>
			options.map(option => (
				<Select.Option key={option.place_id} id={option.place_id}>
					{option.description}
				</Select.Option>
			)),
		[options]
	);

	return (
		<Select
			defaultValue={defaultPlace?.placeId}
			isAutocomplete
			isExternalFiltered
			areExternalOptionsValid={areOptionsValid}
			onBlur={onSelectBlurred}
			onInputChange={setInputValue}
			onOptionChange={onSelectOptionChange}
			{...rest}
		>
			{selectOptions}
		</Select>
	);
};

export default React.memo(GoogleMapsAutocomplete);
