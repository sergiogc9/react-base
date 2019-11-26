import { put } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { operators as notificationsOperators } from '@src/store/app/notifications';

export function* setWrongPath(info: { message?: string, redirectTo?: string }) {
	if (info.message) yield put(notificationsOperators.add({ notification: { text: info.message, level: "warning" } }));
	else yield put(notificationsOperators.add({ notification: { t: "error.page_not_found", level: "warning" } }));
	yield put(push(info.redirectTo || "/"));
}
