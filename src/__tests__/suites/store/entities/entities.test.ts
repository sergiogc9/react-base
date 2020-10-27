import { selectors } from 'store/entities';
import { actions } from 'store/entities/Author';
import TestUtils from '__tests__/utils';

let store = TestUtils.getStore();

describe('Base entities store', () => {

	it('should return entity status', () => {
		expect(selectors.getEntityFetchStatus(store.getState(), 'author')).toEqual('pending');
	});

	it('should return true when entity is fetched', () => {
		store.dispatch(actions.fetchAuthorsSuccess());
		expect(selectors.isEntityFetched(store.getState(), 'author')).toBe(true);
	});

	it('should return false when entity is not fetched', () => {
		expect(selectors.isEntityFetched(store.getState(), 'book')).toBe(false);
	});
});
