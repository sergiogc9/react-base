import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as authActions } from 'store/auth';
import authSelectors from 'store/auth/selectors';
import AuthLoader from 'components/App/Auth/Loader';

const withAuth = (Component: React.FC) => {
	return React.memo(props => {
		const isAuthenticated = useSelector(authSelectors.isAuthenticated);
		const dispatch = useDispatch();

		React.useEffect(() => {
			if (!isAuthenticated) dispatch(authActions.fetchAuth());
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		if (!isAuthenticated) return <AuthLoader />;

		return <Component {...props} />;
	});
};
export default withAuth;
