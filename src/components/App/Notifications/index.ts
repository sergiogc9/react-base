import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { operators } from '@src/store/app/notifications';
import { State } from '@src/store/types';
import { Notification } from '@src/types/notification';
import { DispatchProps, StateProps } from './types';

import Notifications from './Notifications';

const mapStateToProps = ({ app: { notifications: { queue } } }: State): StateProps => ({
	notifications: queue
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
	onAddNotification: (notification: Notification) => dispatch(operators.add({ notification })),
	onUnqueueNotification: () => dispatch(operators.unqueue())
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
