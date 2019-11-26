import { createReducer, ReducerHandlers } from '@src/lib/reducer';
import {  operators } from './actions';

export type State = {};

export const INITIAL_STATE: State = {};

const reducerHandlers: ReducerHandlers<State> = {};

export const reducers = createReducer<State>(INITIAL_STATE, reducerHandlers, operators);
