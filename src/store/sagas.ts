import { all } from 'redux-saga/effects';

import authSagas from './auth/sagas';
import entitySagas from './entities/sagas';
import uiSagas from './ui/sagas';

// define sagas generator function to register all sagas
export default function* sagas() {
	yield all([authSagas(), entitySagas(), uiSagas()]);
}
