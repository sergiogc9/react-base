import { useSelector as reduxUseSelector } from 'react-redux';

import { State } from 'store/types';

type Selector<T> = (state :State) => T;

const useSelector = <T>(selector: Selector<T>) => reduxUseSelector<State, T>(selector);

export { useSelector };
