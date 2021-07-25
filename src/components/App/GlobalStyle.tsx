import { createGlobalStyle } from 'styled-components';
import { reset } from '@sergiogc9/react-ui-theme';

const GlobalStyle = createGlobalStyle`
	${reset}

	html, body, #root {
		height: 100%;
	}
`;

export default GlobalStyle;
