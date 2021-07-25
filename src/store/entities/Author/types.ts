import { EntityState } from '@reduxjs/toolkit';
import { EntitiesFetchData } from '@sergiogc9/react-utils';

import { Overwrite } from 'types/generics';
import { Book } from 'store/entities/Book/types';

export type Author = {
	id: string;
	name: string;
	books: string[];
};
export type AuthorRelations = {
	books: Book[];
};
export type AuthorPopulated<R extends keyof AuthorRelations = never> = Overwrite<Author, Pick<AuthorRelations, R>>;

export type State = EntityState<Author> & EntitiesFetchData;
