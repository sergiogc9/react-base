import React from 'react';

import ErrorBoundary from 'components/common/ErrorBoundary';

const withErrorBoundary = (Component: React.FC) => {
	return React.memo(props => (
		<ErrorBoundary>
			<Component {...props} />
		</ErrorBoundary>
	));
};
export default withErrorBoundary;
