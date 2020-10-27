import { QueryConfig, QueryKey, TypedQueryFunction, useQuery } from 'react-query';

import { store } from 'store';
import { actions } from 'store/notifications';
import { Notification } from 'types/notification';
import errorsConfig from 'config/api/error';
import successConfig from 'config/api/success';
import { getNotificationConfig, getNotificationFromConfigResult } from '.';

export const useApiQuery = <T>(actionKey: string, queryKey: QueryKey, queryFn: TypedQueryFunction<T>, queryConfig?: QueryConfig<T, unknown>) => {
	const config: QueryConfig<T, unknown> = {
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
