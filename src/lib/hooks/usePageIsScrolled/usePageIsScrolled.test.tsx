import React from 'react';
import { fireEvent } from '@testing-library/react';
import { find } from 'lib/imports/lodash';

import TestUtils from 'lib/tests';
import { actions } from 'store/ui';
import usePageIsScrolled from 'lib/hooks/usePageIsScrolled';

describe('usePageIsScrolled hook', () => {
	const getScrollComponent = () => {
		const Component = () => {
			const ref = React.useRef(null);
			usePageIsScrolled(ref);

			return <div className="scrollable" ref={ref} />;
		};
		return TestUtils.renderWithMockedStore(<Component />);
	};

	const getNonReferencedScrollComponent = () => {
		const Component = () => {
			const ref = React.useRef(null);
			usePageIsScrolled(ref);

			return <div className="scrollable" />;
		};
		return TestUtils.renderWithMockedStore(<Component />);
	};

	it('usePageIsScrolled should do nothing if not reference is passed', () => {
		const { store } = getNonReferencedScrollComponent();
		expect(store.getActions()).toEqual([]);
	});

	it('usePageIsScrolled should set not scrolled by default', () => {
		const { store } = getScrollComponent();
		expect(find(store.getActions(), ['type', actions.setIsPageScrolled.type])).toBeTruthy();
		expect(store.getActions()[0].payload).toBe(false);
	});

	it('usePageIsScrolled should set scroll after scroll', () => {
		const { container, store } = getScrollComponent();
		fireEvent.scroll(container.querySelector('.scrollable')!, {
			target: { scrollTop: 300 }
		});
		expect(store.getActions()[1].payload).toBe(true);
	});

	it('usePageIsScrolled should set scroll to false after scrolling up', () => {
		const { container, store } = getScrollComponent();
		fireEvent.scroll(container.querySelector('.scrollable')!, {
			target: { scrollTop: 300 }
		});
		fireEvent.scroll(container.querySelector('.scrollable')!, {
			target: { scrollTop: 1000 }
		});
		fireEvent.scroll(container.querySelector('.scrollable')!, {
			target: { scrollTop: 0 }
		});
		expect(store.getActions()[2].payload).toBe(false);
	});
});
