import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { reducers } from 'store';
import { actions, selectors } from 'store/entities/Book';
import sagas, { delay } from 'store/entities/Book/sagas';
import TestUtils from '__tests__/utils';

let store = TestUtils.getStore();

const book = TestUtils.getBook();
const book2 = TestUtils.getBook({ id: 'book-2' });
const book3 = TestUtils.getBook({ id: 'book-3' });

describe('Book entity', () => {

	it('should have no books in store', () => {
		expect(selectors.selectTotal(store.getState())).toEqual(0);
		expect(selectors.selectAll(store.getState())).toEqual([]);
	});

	it('should add a new book', () => {
		store.dispatch(actions.addOne(book));
		expect(selectors.selectTotal(store.getState())).toEqual(1);
		expect(selectors.selectAll(store.getState())).toEqual([book]);
	});

	it('should add many books', () => {
		store.dispatch(actions.addMany([book2, book3]));
		expect(selectors.selectTotal(store.getState())).toEqual(3);
		expect(selectors.selectAll(store.getState())).toEqual([book, book2, book3]);
	});

	it('should remove one book', () => {
		store.dispatch(actions.removeOne(book.id));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([book2, book3]);
	});

	it('should remove many books', () => {
		store.dispatch(actions.removeMany([book2.id, book3.id]));
		expect(selectors.selectTotal(store.getState())).toEqual(0);
		expect(selectors.selectAll(store.getState())).toEqual([]);
	});

	it('should set all books', () => {
		store.dispatch(actions.setAll([book, book3]));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([book, book3]);
	});

	it('should update one book', () => {
		store.dispatch(actions.updateOne({ id: book.id, changes: { title: 'New title' } }));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([{ ...book, title: 'New title' }, book3]);
	});

	it('should update many books', () => {
		store.dispatch(actions.updateMany([{ id: book.id, changes: { title: 'New title' } }, { id: book3.id, changes: { title: 'New title 3' } }]));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([{ ...book, title: 'New title' }, { ...book3, title: 'New title 3' }]);
	});

	it('should upsert one book', () => {
		store.dispatch(actions.upsertOne({ id: book.id, title: 'New title 2' }));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectById(store.getState(), book.id)).toEqual({ ...book, title: 'New title 2' });
	});

	it('should upsert many books', () => {
		store.dispatch(actions.upsertMany([book, book3]));
		expect(selectors.selectTotal(store.getState())).toEqual(2);
		expect(selectors.selectAll(store.getState())).toEqual([book, book3]);
	});

	it('should select all books', () => {
		expect(selectors.selectAll(store.getState())).toEqual([book, book3]);
	});

	it('should select book by id', () => {
		expect(selectors.selectById(store.getState(), book3.id)).toEqual(book3);
	});

	it('should select books entities', () => {
		expect(selectors.selectEntities(store.getState())).toEqual({ [book.id]: book, [book3.id]: book3 });
	});

	it('should select books ids', () => {
		expect(selectors.selectIds(store.getState())).toEqual([book.id, book3.id]);
	});

	it('should select total', () => {
		expect(selectors.selectTotal(store.getState())).toEqual(2);
	});

	it('should fetch books', async () => {
		await expectSaga(sagas)
			.withReducer(reducers)
			.withState(TestUtils.getFullState())
			.provide([
				[call.fn(delay), null]
			])
			.put(actions.fetchBooksError({ code: 'FAKE_CODE', message: 'A fake API error has been thrown! 😄' }))
			.dispatch(actions.fetchBooksStart())
			.silentRun();
	});
});
