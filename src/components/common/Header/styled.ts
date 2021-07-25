import styled from 'styled-components';

const StyledHeader = styled.header`
	& {
		width: 100%;
		display: flex;
		align-items: center;
		border-bottom: thin solid transparent;
		transition: box-shadow 0.15s ease-in-out;
		z-index: 1;

		&.with-border {
			box-shadow: ${props => props.theme.shadows.down};
		}

		#headerLogo > svg,
		#headerMenuIcon {
			color: ${props => props.theme.colors.neutral[700]};
			opacity: 0.5;
			transition: opacity 0.25s ease-in-out;

			&:hover {
				opacity: 1;
			}
		}
	}
`;

export default StyledHeader;
