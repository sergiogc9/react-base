import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { operators as notificationsOperators } from '@src/store/app/notifications';
import { DispatchProps, StateProps } from './types';
import FormFileField from './FormFileField';

const mapStateToProps = (): StateProps => ({});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
	onAddNotification: notification => dispatch(notificationsOperators.add({notification}))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormFileField);
