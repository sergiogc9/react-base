import React from 'react';

import ErrorBoundary from 'components/common/ErrorBoundary';

const withErrorBoundary = <T extends React.ComponentType<any>>(Component: T) => {
	return React.memo<React.ComponentProps<T>>(props => (
		<ErrorBoundary>
			<Component {...props} />
		</ErrorBoundary>
	));
};
export default withErrorBoundary;
