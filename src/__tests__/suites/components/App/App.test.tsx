import React from "react";
import { fireEvent } from "@testing-library/react";

import { renderWithStore, StateSlice } from "__tests__/utils/redux";
import { actions as UIActions } from 'store/ui';
import { actions as counterActions } from 'store/ui/counter';
import App from "components/App";

describe('App', () => {

	const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<App />, stateSlice);

	it("should render link element", () => {
		const { getByText } = renderComponent();
		expect(getByText(/learn react/i)).toBeInTheDocument();
	});

	it("should value be hidden when mounting", () => {
		const { queryByText, store } = renderComponent();
		expect(queryByText('Value: 50')).toBeFalsy();
		expect(store.getState().ui._.loading).toBe(true);
	});

	it("should value be shown after fetch is success", () => {
		const { queryByText, store } = renderComponent({ ui: { counter: { value: 50 } } });
		store.dispatch(UIActions.fetchDataSuccess());
		store.dispatch(counterActions.fetchCounterSuccess(100));
		expect(queryByText('Value: 100')).toBeInTheDocument();
		expect(store.getState().ui._.loading).toBe(false);
	});

	it("should change text value using input", () => {
		const { getByText, getByTestId, store } = renderComponent();
		store.dispatch(UIActions.fetchDataSuccess());
		store.dispatch(counterActions.fetchCounterSuccess(100));
		const button = getByText('Set value');
		const input = getByTestId('value-input');
		fireEvent.change(input, { target: { value: 20 } });
		fireEvent.click(button);
		expect(getByText('Value: 20')).toBeInTheDocument();
	});

	it("should increment the value by 1", () => {
		const { getByText, store } = renderComponent();
		store.dispatch(UIActions.fetchDataSuccess());
		store.dispatch(counterActions.fetchCounterSuccess(100));
		const button = getByText('Increment by 1');
		fireEvent.click(button);
		expect(getByText('Value: 101')).toBeInTheDocument();
	});
});
