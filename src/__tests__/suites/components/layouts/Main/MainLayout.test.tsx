import React from "react";

import { renderWithStore, StateSlice } from "__tests__/utils/redux";
import MainLayout from "components/layouts/Main/MainLayout";

describe('MainLayout', () => {
	const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<MainLayout />, stateSlice);

	it("should render text", () => {
		const { getByText } = renderComponent();
		expect(getByText('Main Layout')).toBeInTheDocument();
	});
});
