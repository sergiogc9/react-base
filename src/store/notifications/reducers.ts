import { createSlice, getReducer } from '@sergiogc9/react-utils';
import { Notification } from 'types/notification';

export type State = {
	readonly items: Record<string, Notification>;
};

export const INITIAL_STATE: State = {
	items: {}
};

const addNotification = getReducer<State, Notification>((state, { payload: notification }) => {
	const key = `${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`;
	state.items[key] = notification;
});
const removeNotification = getReducer<State, string>((state, { payload: key }) => {
	delete state.items[key];
});

const { actions, reducer } = createSlice({
	name: '@@notifications',
	initialState: INITIAL_STATE,
	reducers: {
		addNotification,
		removeNotification
	}
});

export { actions, reducer };
