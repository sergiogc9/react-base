import React from 'react';

import TestUtils from 'lib/tests';
import Responsive from 'components/common/Responsive';
import { ComponentProps } from 'components/common/Responsive/types';

const text = 'Awesome!';
const xsWidth = 100;
const mdWidth = 1000;
const lgWidth = 1500;
describe('Responsive', () => {
	const getComponent = (props: Partial<ComponentProps> = {}) =>
		TestUtils.renderWithStore(
			<Responsive visibility={['xs', 'sm', 'md']} {...props}>
				<div>{text}</div>
			</Responsive>
		);

	it('should render content if visibility includes mobile and size is xs', () => {
		TestUtils.simulateScreenWidthChange(xsWidth);
		const { getByText } = getComponent({ visibility: ['xs'] });
		expect(getByText(text)).toBeInTheDocument();
	});

	it('should not render content if visibility not includes xs and size is xs', () => {
		TestUtils.simulateScreenWidthChange(xsWidth);
		const { queryByText } = getComponent({ visibility: ['md', 'lg'] });
		expect(queryByText(text)).toBeNull();
	});

	it('should render content if visibility includes md and size is md', () => {
		TestUtils.simulateScreenWidthChange(mdWidth);
		const { getByText } = getComponent({ visibility: ['md'] });
		expect(getByText(text)).toBeInTheDocument();
	});

	it('should not render content if visibility not includes md and size is md', () => {
		TestUtils.simulateScreenWidthChange(mdWidth);
		const { queryByText } = getComponent({ visibility: ['xs', 'lg'] });
		expect(queryByText(text)).toBeNull();
	});

	it('should render content if visibility includes lg and size is lg', () => {
		TestUtils.simulateScreenWidthChange(lgWidth);
		const { getByText } = getComponent({ visibility: ['lg'] });
		expect(getByText(text)).toBeInTheDocument();
	});

	it('should not render content if visibility not includes lg and size is lg', () => {
		TestUtils.simulateScreenWidthChange(lgWidth);
		const { queryByText } = getComponent({ visibility: ['xs', 'md'] });
		expect(queryByText(text)).toBeNull();
	});
});
