import React from 'react';
import { Box, Skeleton } from '@sergiogc9/react-ui';

import { TableSkeletonToolbarProps } from './types';

const TableSkeletonToolbar: React.FC<TableSkeletonToolbarProps> = () => {
	return (
		<Box justifyContent="space-between" marginY={3}>
			<Skeleton.Rect height={24} width={150} />
			<Skeleton.Rect height={24} width={200} />
		</Box>
	);
};

export default React.memo(TableSkeletonToolbar);
