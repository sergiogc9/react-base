import React from "react";

import { renderWithStore, StateSlice } from "__tests__/utils/redux";
import PokemonLayout from "components/layouts/Pokemon/PokemonLayout";

describe('PokemonLayout', () => {
	const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<PokemonLayout />, stateSlice);

	it("should render text", () => {
		const { getByText } = renderComponent();
		expect(getByText('Pokemon Layout')).toBeInTheDocument();
	});
});
