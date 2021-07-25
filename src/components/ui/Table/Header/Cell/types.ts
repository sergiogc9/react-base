import { HeaderProps, ColumnInstance } from 'react-table';
import { BoxProps } from '@sergiogc9/react-ui';

export type TableHeaderCellProps = BoxProps & HeaderProps<any>;

export type StyledTableHeaderCellProps = BoxProps & {
	readonly canSort: ColumnInstance['canSort'];
};
