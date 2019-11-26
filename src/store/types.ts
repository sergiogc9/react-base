import { RouterState } from 'connected-react-router';
import { State as AppState } from './app';

// export root store state interface
export interface State {
	app: AppState;
	router: RouterState;
}
