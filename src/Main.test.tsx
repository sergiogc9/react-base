import React from 'react';
import { render, screen } from '@testing-library/react';

import Main from 'Main';

jest.mock('@tanstack/react-query-devtools', () => ({ ReactQueryDevtools: () => <></> }));

describe('Main', () => {
	it('should render the app', () => {
		render(<Main />);

		expect(screen.getByTestId('loadingLogoSpinner')).toBeInTheDocument();
	});
});
