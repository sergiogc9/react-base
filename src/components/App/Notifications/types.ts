import { Notification, QueueNotification } from '@src/types/notification';

export type StateProps = {
	notifications: QueueNotification[]
};

export type DispatchProps = {
	onAddNotification: (notification: Notification) => void,
	onUnqueueNotification: () => void
};

export type OwnProps = {};

export type ComponentProps = StateProps & DispatchProps & OwnProps;
