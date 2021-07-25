import { State as AuthState } from './auth';
import { State as EntitiesState } from './entities';
import { State as NotificationsState } from './notifications';
import { State as UIState } from './ui';

// export root store state interface
export interface State {
	auth: AuthState;
	entities: EntitiesState;
	notifications: NotificationsState;
	ui: UIState;
}
