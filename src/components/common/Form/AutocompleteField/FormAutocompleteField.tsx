import React from 'react';
import Autocomplete from 'react-md/lib/Autocompletes/Autocomplete';
import Button from 'react-md/lib/Buttons';
import isURL from 'validator/lib/isURL';
import get from 'lodash/get';
import has from 'lodash/has';

import { withT, TProps } from '@src/lib/i18n';
import { AutocompleteFieldElement, FormFieldItem } from '@src/types/form';
import { formFieldBaseValidation } from '@src/components/common/Form/Form';
import { useTimeout, useForceFieldValue } from '@src/lib/hooks';

import './FormAutocompleteField.scss';

export type ComponentProps = TProps & {
	element: AutocompleteFieldElement,
	forceValue?: FormFieldItem,
	error: boolean,
	onAutocompleteSelected: (elementId: string, value: string, isValid: boolean) => void,
	onUpdateItems?: (newValue: string) => Promise<AutocompleteFieldElement["items"]>
};

const __validateAutocompleteField = (element: AutocompleteFieldElement, newItem: FormFieldItem) => {
	if (!formFieldBaseValidation(element, newItem.value)) return false;
	if (!element.validations) return true;
	if (element.validations.url && !isURL(newItem.value)) return false;
	return true;
};

const __mapItems = (items: AutocompleteFieldElement["items"]) => items.map(item => ({ label: item.label, value: item.value, key: item.value }));

const FormAutocompleteField = (props: ComponentProps) => {
	const { t, element, forceValue, error, onAutocompleteSelected, onUpdateItems } = props;

	const defaultItems = React.useMemo(() => __mapItems(element.items), [element.items]);
	const [selectedItem, setSelectedItem] = React.useState<FormFieldItem>(element.defaultValue ? element.defaultValue : { label: "", value: "" });
	const [items, setItems] = React.useState(defaultItems);
	const { run: runTO, clear: clearTO } = useTimeout();
	useForceFieldValue(forceValue, v => v.value, element, setSelectedItem, onAutocompleteSelected, __validateAutocompleteField);

	React.useEffect(() => {
		if (onUpdateItems && selectedItem.value) {
			const updateItems = async (val: string) => {
				setItems(__mapItems(await onUpdateItems(val)));
			};

			runTO(() => updateItems(selectedItem.value), 200);
		}
		return clearTO;
	}, [selectedItem.value, onUpdateItems, runTO, clearTO]);

	const __onChangeHandler = React.useCallback((val: string) => setSelectedItem({ label: val, value: val }), []);
	const __onBlurHandler = React.useCallback(
		() => onAutocompleteSelected(element.id, selectedItem.value, __validateAutocompleteField(element, selectedItem)),
		[element, selectedItem, onAutocompleteSelected]
	);
	const __onAutocompleteHandler = React.useCallback((suggestion, index, results: any) => setSelectedItem({
		label: element.useValueFromAutocomplete ? results[index].value : results[index].label,
		value: results[index].value
	}), [element]);
	const __onCloseBtnClickHandler = React.useCallback(() => setSelectedItem({ label: "", value: "" }), []);

	return (
		<>
			<Autocomplete
				id={`formAutocompleteField-${element.id}`}
				className={`discover-form-autocomplete-field ${element.closeButton ? "with-button " : ""}${element.className || ""}`}
				label={has(element, 'label.key') ? t(get(element, 'label.key')) : element.label}
				data={items}
				dataLabel="label"
				dataValue="value"
				value={selectedItem.label}
				onChange={__onChangeHandler}
				onBlur={__onBlurHandler}
				onAutocomplete={__onAutocompleteHandler}
				error={error}
				showUnfilteredData={element.alwaysShowItems}
				clearOnAutocomplete={false}
				{...element.inputProps}
			/>
			{element.closeButton ?
				<Button
					id={`formAutocompleteFieldCloseBtn-${element.id}`}
					icon
					iconChildren="close"
					children=""
					onChange={__onCloseBtnClickHandler}
				/> : null}

		</>
	);
};

export default withT(React.memo(FormAutocompleteField));
