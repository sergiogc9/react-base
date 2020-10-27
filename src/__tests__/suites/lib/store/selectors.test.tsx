import React from 'react';
import { Provider } from 'react-redux';
import { render } from "@testing-library/react";

import { useSelector } from 'lib/store/selectors';
import selectors from 'store/ui/counter/selectors';
import { getStore } from '__tests__/utils/redux';

const store = getStore();

const FakeComponent: React.FC = () => {
	const value = useSelector(selectors.getValue);
	return <p>Value: {value}</p>;
};

describe('Store selectors lib', () => {
	it("should useSelector return selected value", () => {
		const { getByText } = render(<Provider store={store}><FakeComponent /></Provider>);
		expect(getByText('Value: 10')).toBeInTheDocument();
	});
});
