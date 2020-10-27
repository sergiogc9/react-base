import { State as RootState } from 'store/types';
import { entityAdapter } from './reducers';

const entitySelectors = entityAdapter.getSelectors((state: RootState) => state.entities.book);
const selectors = {
	...entitySelectors
};

export default selectors;
