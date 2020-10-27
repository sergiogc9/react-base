import React from "react";
import { render } from '@testing-library/react';

import Icon from 'ui/components/Icon';

describe('Icon', () => {

	it("should render text", () => {
		const { baseElement } = render(<Icon icon='clear' />);
		expect(baseElement.innerHTML).toMatchSnapshot();
	});
});
