import { createMuiTheme } from '@material-ui/core/styles';
import { DefaultTheme } from 'styled-components';

import reset from './reset';

const MuiTheme = createMuiTheme({
	palette: { primary: { main: '#06a7e2' } },
	typography: { htmlFontSize: 10 }
});

const theme: DefaultTheme = {
	...MuiTheme,
	space: [0, 4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80].map(px => `${px / 10}rem`)
};

export { reset, MuiTheme };
export default theme;
