import { EntityState } from '@reduxjs/toolkit';
import { EntitiesFetchData } from '@sergiogc9/react-utils';

export type Book = {
	id: string;
	title: string;
};

export type State = EntityState<Book> & EntitiesFetchData;
