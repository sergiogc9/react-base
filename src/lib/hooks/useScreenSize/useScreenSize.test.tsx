import React from 'react';
import { waitFor } from '@testing-library/react';

import TestUtils from 'lib/tests';
import useScreenSize from 'lib/hooks/useScreenSize';

describe('useScreenSize hook', () => {
	const getComponent = () => {
		const Component = () => {
			const size = useScreenSize();

			return <div>{size}</div>;
		};
		return TestUtils.renderWithMockedStore(<Component />);
	};

	it('should detect xs screen', async () => {
		const { getByText } = getComponent();
		TestUtils.simulateScreenWidthChange(100);
		await waitFor(() => expect(getByText('xs')).toBeInTheDocument());
	});

	it('should detect sm screen', async () => {
		const { getByText } = getComponent();
		TestUtils.simulateScreenWidthChange(500);
		await waitFor(() => expect(getByText('sm')).toBeInTheDocument());
	});

	it('should detect md screen', async () => {
		const { getByText } = getComponent();
		TestUtils.simulateScreenWidthChange(800);
		await waitFor(() => expect(getByText('md')).toBeInTheDocument());
	});

	it('should detect lg screen', async () => {
		const { getByText } = getComponent();
		TestUtils.simulateScreenWidthChange(1500);
		await waitFor(() => expect(getByText('lg')).toBeInTheDocument());
	});

	it('should detect xl screen', async () => {
		const { getByText } = getComponent();
		TestUtils.simulateScreenWidthChange(2000);
		await waitFor(() => expect(getByText('xl')).toBeInTheDocument());
	});
});
