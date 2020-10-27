import React from "react";
import { fireEvent, render } from "@testing-library/react";

import Counter from "components/pages/Main/Counter";
import { ComponentProps } from "components/pages/Main/Counter/MainCounter";

let onIncrementMock = jest.fn();
let onSetValueMock = jest.fn();
describe('MainCounter', () => {
	const renderComponent = (props: Partial<ComponentProps> = {}) => {
		return render(
			<Counter
				defaultValue={10}
				onIncrement={onIncrementMock}
				onSetValue={onSetValueMock}
				{...props}
			/>
		);
	};

	beforeEach(() => {
		onIncrementMock = jest.fn();
		onSetValueMock = jest.fn();
	});

	it("should render input", () => {
		const { getByTestId } = renderComponent();
		expect(getByTestId('value-input')).toBeTruthy();
		expect((getByTestId('value-input') as any).value).toBe('10');
	});

	it("should change input value", () => {
		const { getByTestId } = renderComponent();
		const input = getByTestId('value-input');
		fireEvent.change(input, { target: { value: 20 } });
		expect((input as any).value).toBe('20');
	});

	it("should call on set value handler", () => {
		const { getByText, getByTestId } = renderComponent();
		const button = getByText('Set value');
		const input = getByTestId('value-input');
		fireEvent.change(input, { target: { value: 20 } });
		fireEvent.click(button);
		expect(onSetValueMock).toHaveBeenCalledWith(20);
	});

	it("should call on increment value handler", () => {
		const { getByText } = renderComponent();
		const button = getByText('Increment by 1');
		fireEvent.click(button);
		expect(onIncrementMock).toHaveBeenCalledTimes(1);
	});
});
