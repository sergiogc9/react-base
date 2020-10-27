import React from "react";
import axiosMock from 'jest-mock-axios';
import { waitFor } from "@testing-library/react";

import { renderWithStore, StateSlice } from "__tests__/utils/redux";
import PokemonItemPage from "components/pages/Pokemon/Item";

describe('PokemonItemPage', () => {
	const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<PokemonItemPage />, stateSlice);

	beforeEach(() => {
		axiosMock.reset();
		axiosMock.get.mockResolvedValue(new Promise(resolve => resolve({ data: { name: 'pikachu', base_experience: 100 } })));
	});

	it("should render text", async () => {
		const { getByText } = renderComponent();
		expect(getByText('Pokemon item page')).toBeInTheDocument();
		await waitFor(() => expect(getByText('Name: pikachu')).toBeInTheDocument());
	});
});
