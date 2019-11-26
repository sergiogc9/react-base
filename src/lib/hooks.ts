import React from 'react';
import { FormFieldElement } from '@src/types/form';

// This hooks is used to know if component is yet mounted
const useIsMounted = () => {
	const isMounted = React.useRef(false);

	React.useEffect(function setIsMounted() {
		isMounted.current = true;

		return () => {
			isMounted.current = false;
		};
	}, []);

	return isMounted;
};

// This is a helper hook to only execute useEffect in update events
export const useUpdateEffect = (effect: React.EffectCallback, dependencies: readonly any[]) => {
	const isMounted = useIsMounted();
	const isInitialMount = React.useRef(true);

	React.useEffect(() => {
		let effectCleanupFunc = () => { };

		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			effectCleanupFunc = effect() || effectCleanupFunc;
		}
		return () => {
			effectCleanupFunc();
			if (!isMounted.current) {// eslint-disable-line react-hooks/exhaustive-deps
				isInitialMount.current = true;
			}
		};
	}, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

// Hook to handle timeouts. Useful inside useEffect hook.
export const useTimeout = () => {
	const timeoutId = React.useRef<number>();

	const clear = React.useCallback(() => {
		if (timeoutId.current) clearTimeout(timeoutId.current);
	}, []);

	const run = React.useCallback((callback: Function, delay: number) => {
		clear();
		timeoutId.current = setTimeout(callback, delay);
	}, [clear]);

	return { run, clear };
};

// Hook to use in FormField to update the value from a prop
// convertValue can be a needed function to convert internal field value state to the value pushed up to form (see FormAutocompleteField as an example)
export const useForceFieldValue = (forcedValue: any, convertValue: ((value: any) => any) | null, element: FormFieldElement, setValueFn: Function, onUpdateFn: Function, onValidateFn: Function) => {
	React.useEffect(() => {
		if (forcedValue) {
			setValueFn(forcedValue);
			onUpdateFn(element.id, convertValue ? convertValue(forcedValue) : forcedValue, onValidateFn(element, forcedValue));
		}
	}, [forcedValue]); // eslint-disable-line react-hooks/exhaustive-deps
};
