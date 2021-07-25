import React from 'react';
import { useTheme } from 'styled-components';
import { Skeleton, SkeletonProps } from '@sergiogc9/react-ui';

import Table from 'components/ui/Table';

const PokemonListPageSkeleton: React.FC<SkeletonProps> = () => {
	const theme = useTheme();

	return (
		<Skeleton flexDirection="column" pb={5} width="100%">
			<Skeleton.Rect height={32} mb={3} width={300} />
			<Table.Skeleton.Toolbar />
			<Table.Skeleton.Content minWidth={theme.breakpoints.lg} />
			<Table.Skeleton.Toolbar />
		</Skeleton>
	);
};

export default React.memo(PokemonListPageSkeleton);
