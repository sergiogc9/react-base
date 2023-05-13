import { useEffect, useRef } from 'react';
import { QueryKey, MutationFunction, QueryFunction, useQuery, useMutation } from '@tanstack/react-query';
import { useUpdateEffect } from '@sergiogc9/react-hooks';

import { store } from 'store';
import { actions as notificationActions } from 'store/notifications';
import { actions as uiActions } from 'store/ui';
import { Notification } from 'types/notification';
import errorsConfig from 'config/api/error';
import successConfig from 'config/api/success';
import { getNotificationConfig, getNotificationFromConfigResult } from 'middleware/api/notifications';

import { QueryConfig, MutationConfig } from './types';

const __getSuccessNotification = (actionKey: string, data: any): Notification | null => {
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

const useApiQuery = <T>(
	actionKey: string,
	queryKey: QueryKey,
	queryFn: QueryFunction<T>,
	queryConfig?: QueryConfig<T>
) => {
	const isBarShown = useRef(false);
	const config: QueryConfig<T> = {
		...queryConfig,
		onSuccess: data => {
			const notification = __getSuccessNotification(actionKey, data);
			if (notification) store.dispatch(notificationActions.addNotification(notification));
			if (queryConfig?.showLoadingBar) {
				isBarShown.current = false;
				store.dispatch(uiActions.removePendingLoadingBarApiCall());
			}
			if (queryConfig?.onSuccess) queryConfig.onSuccess(data);
		},
		onError: err => {
			const notification = __getErrorNotification(actionKey, err);
			if (notification) store.dispatch(notificationActions.addNotification(notification));
			if (queryConfig?.showLoadingBar) {
				isBarShown.current = false;
				store.dispatch(uiActions.removePendingLoadingBarApiCall());
			}
			if (queryConfig?.onError) queryConfig.onError(err);
		}
	};
	const result = useQuery(queryKey, queryFn, config);

	useEffect(() => {
		if (queryConfig?.showLoadingBar) {
			if (result.isFetching) {
				if (!isBarShown.current) {
					isBarShown.current = true;
					store.dispatch(uiActions.addPendingLoadingBarApiCall());
				}
			} else {
				if (isBarShown.current) {
					isBarShown.current = false;
					store.dispatch(uiActions.removePendingLoadingBarApiCall());
				}
			}
		}
	}, [result.isFetching]); // eslint-disable-line react-hooks/exhaustive-deps

	return result;
};

const useApiMutate = <TResult, TError, TVariables>(
	actionKey: string,
	mutateFn: MutationFunction<TResult, TVariables>,
	mutateConfig?: MutationConfig<TResult, TError, TVariables>
) => {
	const isBarShown = useRef(false);
	const config: MutationConfig<TResult, TError, TVariables> = {
		...mutateConfig,
		onSuccess: (data, variables, context) => {
			const notification = __getSuccessNotification(actionKey, data);
			if (notification) store.dispatch(notificationActions.addNotification(notification));
			if (mutateConfig?.showLoadingBar) {
				isBarShown.current = false;
				store.dispatch(uiActions.removePendingLoadingBarApiCall());
			}
			if (mutateConfig?.onSuccess) mutateConfig.onSuccess(data, variables, context);
		},
		onError: (err, variables, onMutateValue) => {
			const notification = __getErrorNotification(actionKey, err);
			if (notification) store.dispatch(notificationActions.addNotification(notification));
			if (mutateConfig?.showLoadingBar) {
				isBarShown.current = false;
				store.dispatch(uiActions.removePendingLoadingBarApiCall());
			}
			if (mutateConfig?.onError) mutateConfig.onError(err, variables, onMutateValue);
		}
	};
	const result = useMutation<TResult, TError, TVariables>(mutateFn, config);

	useUpdateEffect(() => {
		if (mutateConfig?.showLoadingBar) {
			if (result.isLoading) {
				if (!isBarShown.current) {
					isBarShown.current = true;
					store.dispatch(uiActions.addPendingLoadingBarApiCall());
				}
			} else {
				if (isBarShown.current) {
					isBarShown.current = false;
					store.dispatch(uiActions.removePendingLoadingBarApiCall());
				}
			}
		}
	}, [result.isLoading]);

	return result;
};

export { useApiQuery, useApiMutate };
