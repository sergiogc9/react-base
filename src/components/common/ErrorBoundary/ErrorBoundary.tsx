import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import FallbackError from 'components/common/FallbackError';

import { ErrorBoundaryProps } from './types';

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
	const onError = React.useCallback((err: any) => {
		// eslint-disable-next-line no-console
		console.error('ErrorBoundary - An error ocurred:', err);
	}, []);

	return (
		<ReactErrorBoundary FallbackComponent={FallbackError} onError={onError}>
			{children}
		</ReactErrorBoundary>
	);
};

export default React.memo(ErrorBoundary) as React.FC<ErrorBoundaryProps>;
