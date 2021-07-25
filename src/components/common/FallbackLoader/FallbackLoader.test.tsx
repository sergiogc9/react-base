import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import TestUtils from 'lib/tests';
import FallbackLoader from 'components/common/FallbackLoader';

const testId = 'loading';
describe('FallbackLoader', () => {
	const getComponent = () => TestUtils.renderWithStore(<FallbackLoader />);

	it('should not render content at start', () => {
		getComponent();
		expect(screen.queryByTestId(testId)).toBeNull();
	});

	it('should render content at after some time', async () => {
		getComponent();
		await waitFor(() => expect(screen.getByTestId(testId)).not.toBeNull());
	});
});
