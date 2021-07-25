import React from 'react';
import { render } from '@testing-library/react';

import Main from 'Main';

jest.mock('react-query/devtools', () => ({ ReactQueryDevtools: () => <></> }));

describe('Main', () => {
	it('should render the app', () => {
		const { getByText } = render(<Main />);
		expect(getByText('Authenticating!')).toBeInTheDocument();
	});
});
