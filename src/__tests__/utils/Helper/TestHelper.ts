import DocumentHelper from './DocumentHelper';
import UserHelper from './UserHelper';
import ReduxHelper from './ReduxHelper';
import FormHelper from './FormHelper';

export default {
	...DocumentHelper,
	...UserHelper,
	...ReduxHelper,
	...FormHelper
};
