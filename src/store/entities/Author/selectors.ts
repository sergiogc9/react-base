import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'store/types';
import { selectors as BookSelectors } from 'store/entities/Book';
import { entityAdapter } from './reducers';
import { AuthorPopulated } from './types';

const entitySelectors = entityAdapter.getSelectors((state: RootState) => state.entities.author);
const selectWithBooksById = createSelector(
	BookSelectors.selectEntities,
	(state: RootState, id: string) => entitySelectors.selectById(state, id),
	(books, author) =>
		author
			? ({
					...author,
					books: author.books.map(bookId => books[bookId])
			  } as AuthorPopulated<'books'>)
			: undefined
);
const selectAllWithBooks = createSelector(entitySelectors.selectAll, BookSelectors.selectEntities, (authors, books) =>
	authors.map(
		author =>
			({
				...author,
				books: author.books.map(bookId => books[bookId])
			} as AuthorPopulated<'books'>)
	)
);
const selectors = {
	...entitySelectors,
	selectWithBooksById,
	selectAllWithBooks
};

export default selectors;
