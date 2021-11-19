import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import TestUtils from 'lib/tests';
import useScreenSize from 'lib/hooks/useScreenSize';

const getComponent = () => {
	const Component = () => {
		const { size } = useScreenSize();

		return <div>{size}</div>;
	};
	return TestUtils.renderWithMockedStore(<Component />);
};

describe('useScreenSize hook', () => {
	it('should detect xs screen', async () => {
		getComponent();

		TestUtils.simulateScreenWidthChange(100);

		await waitFor(() => expect(screen.getByText('xs')).toBeInTheDocument());
	});

	it('should detect sm screen', async () => {
		getComponent();

		TestUtils.simulateScreenWidthChange(500);

		await waitFor(() => expect(screen.getByText('sm')).toBeInTheDocument());
	});

	it('should detect md screen', async () => {
		getComponent();

		TestUtils.simulateScreenWidthChange(800);

		await waitFor(() => expect(screen.getByText('md')).toBeInTheDocument());
	});

	it('should detect lg screen', async () => {
		getComponent();

		TestUtils.simulateScreenWidthChange(1500);

		await waitFor(() => expect(screen.getByText('lg')).toBeInTheDocument());
	});

	it('should detect xl screen', async () => {
		getComponent();

		TestUtils.simulateScreenWidthChange(2000);

		await waitFor(() => expect(screen.getByText('xl')).toBeInTheDocument());
	});
});
