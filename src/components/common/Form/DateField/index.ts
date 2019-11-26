import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State } from '@src/store/types';
import { DispatchProps, StateProps } from './types';
import FormDateField from './FormDateField';

const mapStateToProps = ({ app: { profile: { user } } }: State): StateProps => ({
	user: user!
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FormDateField);
