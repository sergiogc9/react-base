import { EntityState } from "@reduxjs/toolkit";

import { Overwrite } from "types/generics";
import { EntitiesFetchData } from "store/entities";
import { Book } from "store/entities/Book/types";

export type Author = {
	id: string,
	name: string,
	books: string[]
}
export type AuthorRelations = {
	books: Book[]
}
export type AuthorPopulated<R extends keyof AuthorRelations = never> = Overwrite<Author, Pick<AuthorRelations, R>>;

export type State = EntityState<Author> & EntitiesFetchData;
