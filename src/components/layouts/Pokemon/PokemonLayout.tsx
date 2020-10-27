import React from 'react';
import { Outlet } from 'react-router-dom';

const PokemonLayout: React.FC = () => {
	return (
		<div>
			<p>Pokemon Layout</p>
			<Outlet />
		</div>
	);
};

export default PokemonLayout;
