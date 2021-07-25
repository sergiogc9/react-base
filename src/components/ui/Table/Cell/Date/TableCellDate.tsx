import React from 'react';
import { useTheme } from 'styled-components';
import { DateTime } from 'luxon';

import TableCellDefault from '../Default';
import { TableCellDateProps } from './types';

/**
 * The value must be in ISO format. e.g: 2021-06-15T12:34:18.547Z
 */
const TableCellDate: React.FC<TableCellDateProps> = props => {
	const { value } = props;

	const theme = useTheme();

	return (
		<TableCellDefault aspectSize="s" {...props}>
			{DateTime.fromISO(value).setLocale(theme.locale).toLocaleString(Object.assign(DateTime.DATE_MED))}
		</TableCellDefault>
	);
};

export default React.memo(TableCellDate);
