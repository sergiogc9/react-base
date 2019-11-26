import { createReducer, ReducerHandlers } from '@src/lib/reducer';
import { QueueNotification } from '@src/types/notification';
import { Actions, operators } from './actions';

export interface State {
	readonly queue: QueueNotification[];
	readonly nextId: number;
}

export const INITIAL_STATE: State = {
	queue: [],
	nextId: 1
};

const reducerHandlers: ReducerHandlers<State> = {
	queue: (state, { payload }: Actions["QueueNotification"]): State => ({
		...state,
		nextId: state.nextId + 1,
		queue: [...state.queue, payload.notification]
	}),
	unqueue: (state): State => {
		const queue = [...state.queue].slice(1);
		return {
			...state,
			queue,
			nextId: queue.length ? state.nextId : INITIAL_STATE.nextId
		};
	}
};

export const reducers = createReducer<State>(INITIAL_STATE, reducerHandlers, operators);
