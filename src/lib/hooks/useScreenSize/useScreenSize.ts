import React from 'react';
import { useTheme } from 'styled-components';
import { debounce, isEmpty } from 'lib/imports/lodash';
import { Theme } from '@sergiogc9/react-ui-theme';

// eslint-disable-next-line @typescript-eslint/ban-types
const __listeners: Function[] = [];

const onDebouncedScreenResize = debounce(() => {
	__listeners.forEach(fn => fn());
}, 100);

export type Breakpoint = Exclude<Extract<keyof Theme['breakpoints'], string>, keyof Array<any>>;

const getScreenSize = (theme: Theme): Breakpoint => {
	const screenWidth = window.innerWidth;
	if (screenWidth < parseInt(theme.breakpoints.sm!, 10)) return 'xs';
	if (screenWidth < parseInt(theme.breakpoints.md!, 10)) return 'sm';
	if (screenWidth < parseInt(theme.breakpoints.lg!, 10)) return 'md';
	if (screenWidth < parseInt(theme.breakpoints.xl!, 10)) return 'lg';
	return 'xl';
};

const useScreenSize = () => {
	const theme = useTheme();

	const [size, setSize] = React.useState<Breakpoint>(getScreenSize(theme));

	const onSizeUpdated = React.useCallback(() => setSize(getScreenSize(theme)), [theme]);

	React.useEffect(() => {
		if (isEmpty(__listeners)) {
			window.addEventListener('resize', onDebouncedScreenResize, false);
		}
		__listeners.push(onSizeUpdated);

		return () => {
			__listeners.splice(__listeners.indexOf(onSizeUpdated), 1);
			if (isEmpty(__listeners)) {
				window.removeEventListener('resize', onDebouncedScreenResize, false);
			}
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return size;
};

export default useScreenSize;