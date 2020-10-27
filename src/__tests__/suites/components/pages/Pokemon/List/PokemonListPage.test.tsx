import React from "react";
import axiosMock from 'jest-mock-axios';
import { waitFor } from "@testing-library/react";

import { renderWithStore, StateSlice } from "__tests__/utils/redux";
import PokemonListPage from "components/pages/Pokemon/List";

describe('PokemonListPage', () => {
	const renderComponent = (stateSlice: StateSlice = {}) => renderWithStore(<PokemonListPage />, stateSlice);

	beforeEach(() => {
		axiosMock.reset();
		axiosMock.get.mockResolvedValue(new Promise(resolve => resolve({ data: { results: [{ name: 'pikachu', url: 'fake-url' }] } })));
	});

	it("should render text", async () => {
		const { getByText } = renderComponent();
		expect(getByText('Pokemon list')).toBeInTheDocument();
		await waitFor(() => expect(getByText('pikachu')).toBeInTheDocument());
	});
});
