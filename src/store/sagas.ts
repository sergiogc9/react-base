import { all } from 'redux-saga/effects';

import entitySagas from './entities/sagas';
import uiSagas from './ui/sagas';

// define sagas generator function to register all sagas
export default function* sagas() {
	yield all([
		entitySagas(),
		uiSagas()
	]);
}
