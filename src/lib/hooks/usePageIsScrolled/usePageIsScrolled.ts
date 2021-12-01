import React from 'react';
import { useDispatch } from 'react-redux';

import { actions as uiActions } from 'store/ui';

// This hook has to be used only once at the same time!
// Receives the reference of the container which can scroll inside the page
const usePageIsScrolled = (ref: React.RefObject<HTMLElement>) => {
	const dispatch = useDispatch();

	React.useLayoutEffect(() => {
		let lastScrollTop = 0;
		let isLastFullScroll = false;
		const element = ref.current;
		const handleScroll = () => {
			if (element) {
				if (lastScrollTop === 0 && element.scrollTop > 0) {
					dispatch(uiActions.setIsPageScrolled(true));
				} else if (lastScrollTop !== 0 && element.scrollTop === 0) {
					dispatch(uiActions.setIsPageScrolled(false));
				}
				lastScrollTop = element.scrollTop;
				const isFullScroll = element.scrollTop === element.scrollHeight - element.clientHeight;
				if (isFullScroll && !isLastFullScroll) dispatch(uiActions.setIsPageFullScrolled(true));
				else if (!isFullScroll && isLastFullScroll) dispatch(uiActions.setIsPageFullScrolled(false));
				isLastFullScroll = isFullScroll;
			}
		};

		if (element) {
			element.addEventListener('scroll', handleScroll, {
				capture: false,
				passive: true
			});
			dispatch(uiActions.setIsPageScrolled(element.scrollTop !== 0));
		}
		return () => {
			if (element) element.removeEventListener('scroll', handleScroll);
		};
	}, [ref, dispatch]);
};

export default usePageIsScrolled;
