import React from "react";
import { render } from '@testing-library/react';

import Button from 'ui/components/Button';

describe('Button', () => {

	it("should render text", () => {
		const { baseElement } = render(<Button>This is a test button!</Button>);
		expect(baseElement.innerHTML).toMatchSnapshot();
	});
});
