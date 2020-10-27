import React from "react";

import { renderWithStore, StateSlice } from "__tests__/utils/redux";
import MainPage from "components/pages/Main";

describe('MainPage', () => {
	const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<MainPage />, stateSlice);

	it("should render text", () => {
		const { getByText } = renderComponent();
		expect(getByText(/Main Page/)).toBeInTheDocument();
	});
});
