import { reducers } from 'store';
import { actions, INITIAL_STATE } from 'store/ui';
import selectors from 'store/ui/selectors';
import { getFullState, getStore } from 'lib/tests/redux';

jest.mock('@sergiogc9/react-utils', () => {
	const currentPackage = jest.requireActual('@sergiogc9/react-utils');
	return {
		...currentPackage,
		Storage: {
			get: jest.fn().mockReturnValue('opened'),
			set: jest.fn()
		}
	};
});

let store = getStore();

describe('UI Store', () => {
	it('should have initial state', () => {
		expect(getFullState().ui).toMatchObject(INITIAL_STATE);
	});

	it('should change state with set isPageScrolled reducer', () => {
		expect(reducers(getFullState(), actions.setIsPageScrolled(true)).ui).toMatchObject({
			_: { isPageScrolled: true }
		});
	});

	it('should call getIsPageScrolled selector', () => {
		store = getStore();
		expect(selectors.getIsPageScrolled(store.getState())).toEqual(false);
		store.dispatch(actions.setIsPageScrolled(true));
		expect(selectors.getIsPageScrolled(store.getState())).toEqual(true);
	});
});
