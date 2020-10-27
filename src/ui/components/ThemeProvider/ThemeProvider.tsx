import React from 'react';
import { ThemeProvider as StyledComponentsProvider } from 'styled-components';
import { createMuiTheme, ThemeProvider as MaterialUIProvider } from '@material-ui/core/styles';

import theme from 'ui/theme';

const materialUITheme = createMuiTheme({ typography: { htmlFontSize: 10 } });

const ThemeProvider: React.FC<{ children: JSX.Element }> = props => {
	const { children } = props;

	return (
		<StyledComponentsProvider theme={theme}>
			<MaterialUIProvider theme={materialUITheme}>
				{children}
			</MaterialUIProvider>
		</StyledComponentsProvider>
	);
};

export default React.memo(ThemeProvider);
