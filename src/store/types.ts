import { State as entitiesState } from './entities';
import { State as notificationsState } from './notifications';
import { State as UIState } from './ui';

// export root store state interface
export interface State {
	entities: entitiesState
	notifications: notificationsState
	ui: UIState
}
