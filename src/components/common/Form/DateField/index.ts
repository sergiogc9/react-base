import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State } from '@src/store/types';
import { DispatchProps, StateProps } from './types';
import FormDateField from './FormDateField';

const mapStateToProps = ({}: State): StateProps => ({});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FormDateField);
