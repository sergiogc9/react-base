import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { reducers } from 'store';
import { selectors as entitiesSelectors } from 'store/entities';
import { actions, selectors } from 'store/entities/Author';
import sagas, { delay } from 'store/entities/Author/sagas';
import { actions as bookActions } from 'store/entities/Book';
import TestUtils from '__tests__/utils';

let store = TestUtils.getStore();

const author = TestUtils.getAuthor();
const author2 = TestUtils.getAuthor({ id: 'author-2' });
const author3 = TestUtils.getAuthor({ id: 'author-3' });
const book = TestUtils.getBook();

describe('Author entity', () => {

	it('should have no authors in store', () => {
		expect(selectors.selectTotal(store.getState())).toEqual(0);
		expect(selectors.selectAll(store.getState())).toEqual([]);
	});

	it('should add a new author', () => {
		store.dispatch(actions.addOne(author));
		expect(selectors.selectTotal(store.getState())).toEqual(1);
		expect(selectors.selectAll(store.getState())).toEqual([author]);
	});

	it('should add many authors', () => {
		store.dispatch(actions.addMany([author2, author3]));
		expect(selectors.selectTotal(store.getState())).toEqual(3);
		expect(selectors.selectAll(store.getState())).toEqual([author, author2, author3]);
	});

	it('should remove one author', () => {
		store.dispatch(actions.removeOne(author.id));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([author2, author3]);
	});

	it('should remove many authors', () => {
		store.dispatch(actions.removeMany([author2.id, author3.id]));
		expect(selectors.selectTotal(store.getState())).toEqual(0);
		expect(selectors.selectAll(store.getState())).toEqual([]);
	});

	it('should set all authors', () => {
		store.dispatch(actions.setAll([author, author3]));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([author, author3]);
	});

	it('should update one author', () => {
		store.dispatch(actions.updateOne({ id: author.id, changes: { name: 'New name' } }));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([{ ...author, name: 'New name' }, author3]);
	});

	it('should update many authors', () => {
		store.dispatch(actions.updateMany([{ id: author.id, changes: { name: 'New name' } }, { id: author3.id, changes: { name: 'New name 3' } }]));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([{ ...author, name: 'New name' }, { ...author3, name: 'New name 3' }]);
	});

	it('should upsert one author', () => {
		store.dispatch(actions.upsertOne({ id: author.id, name: 'New name 2', books: [] }));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectById(store.getState(), author.id)).toEqual({ ...author, name: 'New name 2' });
	});

	it('should upsert many authors', () => {
		store.dispatch(actions.upsertMany([author, author3]));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([author, author3]);
	});

	it('should return error when fetch fails', () => {
		store.dispatch(actions.fetchAuthorsError(TestUtils.getApiError()));
		expect(entitiesSelectors.getEntityFetchStatus(store.getState(), 'author')).toBe('error');
	});

	it('should select all authors', () => {
		expect(selectors.selectAll(store.getState())).toEqual([author, author3]);
	});

	it('should select author by id', () => {
		expect(selectors.selectById(store.getState(), author3.id)).toEqual(author3);
	});

	it('should select authors entities', () => {
		expect(selectors.selectEntities(store.getState())).toEqual({ [author.id]: author, [author3.id]: author3 });
	});

	it('should select authors ids', () => {
		expect(selectors.selectIds(store.getState())).toEqual([author.id, author3.id]);
	});

	it('should select total', () => {
		expect(selectors.selectTotal(store.getState())).toEqual(2);
	});

	it('should select author with books by id', () => {
		store.dispatch(bookActions.addOne(book));
		store.dispatch(actions.updateOne({ id: author.id, changes: { books: [book.id] } }));
		expect(selectors.selectWithBooksById(store.getState(), author.id)).toEqual({ ...author, books: [book] });
	});

	it('should not select not existing author with books by id', () => {
		expect(selectors.selectWithBooksById(store.getState(), 'no-exists')).toBe(undefined);
	});

	it('should select all authors with books', () => {
		expect(selectors.selectAllWithBooks(store.getState())).toEqual([{ ...author, books: [book] }, author3]);
	});

	it('should fetch authors', async () => {
		await expectSaga(sagas)
			.withReducer(reducers)
			.withState(TestUtils.getFullState())
			.provide([
				[call.fn(delay), null]
			])
			.put(actions.fetchAuthorsSuccess())
			.dispatch(actions.fetchAuthorsStart())
			.silentRun();
	});
});
