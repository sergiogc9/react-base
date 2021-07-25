import React from 'react';
import { render } from '@testing-library/react';

import useAddMapsScript from '.';

const getComponent = () => {
	const Component = () => {
		useAddMapsScript();

		return <head />;
	};
	return <Component />;
};

describe('useAddMapsScript hook', () => {
	beforeEach(() => {
		document.querySelector('script')?.remove();
	});

	it('should add script', async () => {
		render(getComponent());

		expect(document.querySelector('script#google-maps-api')).toBeInTheDocument();
	});

	it('should only add one script', async () => {
		render(
			<>
				{getComponent()}
				{getComponent()}
			</>
		);

		expect(document.querySelectorAll('script#google-maps-api').length).toBe(1);
	});
});
