import { ReactNode } from 'react';
import { BoxProps } from '@sergiogc9/react-ui';

type TableTotalResultsRenderProps = {
	totalResults: number;
};

type Props = {
	readonly render: (props: TableTotalResultsRenderProps) => ReactNode;
};

export type TableTotalResultsProps = Props & BoxProps;
export type StyledTableTotalResultsProps = BoxProps;
