import { Notification, QueueNotification as QueueNotificationType } from '@src/types/notification';
import { Action, actionCreatorFactory } from 'typescript-fsa';

const actionCreator = actionCreatorFactory('@@app/notifications');

type Payloads = {
	AddNotification: { notification: Notification };
	QueueNotification: { notification: QueueNotificationType };
	UnqueueNotification: void;
}

export type Actions = {
	AddNotification: Action<Payloads["AddNotification"]>;
	QueueNotification: Action<Payloads["QueueNotification"]>;
	UnqueueNotification: Action<Payloads["UnqueueNotification"]>;
}

export const operators = {
	add: actionCreator<Payloads["AddNotification"]>('ADD_NOTIFICATION'),
	queue: actionCreator<Payloads["QueueNotification"]>('QUEUE_NOTIFICATION'),
	unqueue: actionCreator<Payloads["UnqueueNotification"]>('UNQUEUE_NOTIFICATION')
};
