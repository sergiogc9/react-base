import { EntityState } from "@reduxjs/toolkit";

import { EntitiesFetchData } from "store/entities";

export type Book = {
	id: string;
	title: string
}
export type State = EntityState<Book> & EntitiesFetchData;
