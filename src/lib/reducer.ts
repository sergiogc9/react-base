import { Reducer } from 'redux';
import { Action, ActionCreator, isType } from 'typescript-fsa';
import transform from 'lodash/transform';

export type Operators = { [index: string]: ActionCreator<any> };
export type ReducerHandler<State> = (state: State, action: Action<any>) => State;
export type ReducerHandlers<State> = { [index: string]: ReducerHandler<State> };

export function createReducer<State>(INITIAL_STATE: State, reducerHandlers: ReducerHandlers<State>, operators: Operators): Reducer<State, Action<any>> {

	const operationTypes: { [index: string]: string } = transform(reducerHandlers, (result, reducer, operatorName) => {
		if (!operators[operatorName]) console.error(`Reducer for operator ${operatorName} not found in action operators`);
		// @ts-ignore
		else result[operators[operatorName].type] = operatorName;
	}, {});

	return (state: State = INITIAL_STATE, action: Action<any>): State => {
		const actionType = action.type;
		const operatorName = operationTypes[actionType];
		if (operatorName) {
			if (isType(action, operators[operatorName])) return reducerHandlers[operatorName](state, action);
			else console.warn(`Reducer type matched (${actionType} - ${operatorName}) but operator isType failed`);
		}
		return state;
	};
}
