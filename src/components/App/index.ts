import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { operators as authOperators } from '@src/store/app/auth';
import { State } from '@src/store/types';
import { DispatchProps, StateProps } from './types';

import App from './App';

const mapStateToProps = ({ app: { auth, profile: { tenant, user } } }: State): StateProps => ({
	authenticated: auth.authenticated,
	tenant,
	user
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
	onAuth: () => dispatch(authOperators.fetchAuth())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
