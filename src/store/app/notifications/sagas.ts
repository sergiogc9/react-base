import { all, put, select, takeLatest } from 'redux-saga/effects';
import pick from 'lodash/pick';
import some from 'lodash/some';

import i18n from '@src/lib/i18n';
import { State as NotificationsState } from '@src/store/app/notifications';
import { State } from '@src/store/types';
import { QueueNotification } from '@src/types/notification';
import { Actions, operators } from './actions';

export function* sagas() {
	yield all([
		takeLatest(operators.add.type, addNotification)
	]);
}

export function* addNotification({ payload: { notification } }: Actions["AddNotification"]) {
	if (!notification.t && !notification.text) return console.error("Notification: missing 'text' or 't' property", notification);

	const notficationsState: NotificationsState = yield select((state: State) => state.app.notifications);

	let text;
	if (notification.t)
		if (typeof notification.t === 'string') text = i18n.t(notification.t);
		else text = i18n.t(...notification.t);
	else
		text = notification.text as string;

	const queueNotification: QueueNotification = {
		id: notficationsState.nextId,
		text,
		level: notification.level || 'info'
	};

	// set timeout if needed
	if ('timeout' in notification) queueNotification.timeout = notification.timeout;

	// set button options with precedence
	if (notification.buttonIcon) queueNotification.buttonIcon = notification.buttonIcon;
	else if (notification.buttonText) queueNotification.buttonText = notification.buttonText;

	if (some(notficationsState.queue, pick(queueNotification, ["text", "level"]))) return; // duplicated

	yield put(operators.queue({ notification: queueNotification }));
}
