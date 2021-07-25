import {
	UseQueryOptions,
	QueryKey,
	UseMutationOptions,
	MutationFunction,
	QueryFunction,
	useQuery,
	useMutation
} from 'react-query';

import { store } from 'store';
import { actions } from 'store/notifications';
import { Notification } from 'types/notification';
import errorsConfig from 'config/api/error';
import successConfig from 'config/api/success';
import { getNotificationConfig, getNotificationFromConfigResult } from '.';

const __getSuccessNotification = (actionKey: string, data: any): Notification | null => {
	// eslint-disable-next-line react/destructuring-assignment
	const [actionGroup, actionName] = actionKey.split(/\/(?=[^/]+$)/);
	const notificationConfig = getNotificationConfig('reactQuery', successConfig, actionGroup, actionName, '');

	if (notificationConfig) return getNotificationFromConfigResult(data, notificationConfig);
	return null;
};

const __getErrorNotification = (actionKey: string, error: any): Notification | null => {
	const errorCode = error && error.code;
	const [actionGroup, actionName] = actionKey.split(/\/(?=[^/]+$)/);
	const notificationConfig = getNotificationConfig('reactQuery', errorsConfig, actionGroup, actionName, errorCode);

	// Avoid notification in error response
	if (notificationConfig === false) return null;

	return getNotificationFromConfigResult(error, notificationConfig);
};

export const useApiQuery = <T>(
	actionKey: string,
	queryKey: QueryKey,
	queryFn: QueryFunction<T>,
	queryConfig?: UseQueryOptions<T, unknown>
) => {
	const config: UseQueryOptions<T, unknown> = {
		...queryConfig,
		onSuccess: data => {
			const notification = __getSuccessNotification(actionKey, data);
			if (notification) store.dispatch(actions.addNotification(notification));
			if (queryConfig?.onSuccess) queryConfig.onSuccess(data);
		},
		onError: err => {
			const notification = __getErrorNotification(actionKey, err);
			if (notification) store.dispatch(actions.addNotification(notification));
			if (queryConfig?.onError) queryConfig.onError(err);
		}
	};
	return useQuery(queryKey, queryFn, config);
};

export const useApiMutate = <TResult, TError, TVariables>(
	actionKey: string,
	mutateFn: MutationFunction<TResult, TVariables>,
	mutateConfig?: UseMutationOptions<TResult, TError, TVariables>
) => {
	const config: UseMutationOptions<TResult, TError, TVariables> = {
		...mutateConfig,
		onSuccess: (data, variables, context) => {
			const notification = __getSuccessNotification(actionKey, data);
			if (notification) store.dispatch(actions.addNotification(notification));
			if (mutateConfig?.onSuccess) mutateConfig.onSuccess(data, variables, context);
		},
		onError: (err, variables, onMutateValue) => {
			const notification = __getErrorNotification(actionKey, err);
			if (notification) store.dispatch(actions.addNotification(notification));
			if (mutateConfig?.onError) mutateConfig.onError(err, variables, onMutateValue);
		}
	};
	return useMutation<TResult, TError, TVariables>(mutateFn, config);
};
