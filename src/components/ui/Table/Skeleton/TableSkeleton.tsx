import React from 'react';
import { Skeleton } from '@sergiogc9/react-ui';

import { TableSkeletonProps } from './types';

const TableSkeleton: React.FC<TableSkeletonProps> = ({ children, ...rest }) => {
	return (
		<Skeleton flexDirection="column" width="100%" {...rest}>
			{children}
		</Skeleton>
	);
};

export default React.memo(TableSkeleton);
