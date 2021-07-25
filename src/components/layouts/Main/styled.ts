import styled from 'styled-components';

const StyledMainLayout = styled.div`
	&#mainLayout {
		width: 100vw;
		height: 100%;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: 60px auto;
		grid-template-areas:
			'sidebar header'
			'sidebar content';

		> header {
			grid-area: header;
		}

		> main {
			grid-area: content;
			overflow: auto;
			margin-top: 1px;
		}

		> .sidebar {
			grid-area: sidebar;
		}

		@media (max-width: ${props => parseInt(props.theme.breakpoints[2], 10) - 1}px) {
			grid-template-columns: auto;
			grid-template-rows: 60px 1fr 50px;
			grid-template-areas:
				'header'
				'content'
				'sidebar';

			> header {
				height: 60px;
				flex-shrink: 0;
			}
		}
	}
`;

export default StyledMainLayout;
