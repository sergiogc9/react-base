import styled from 'styled-components';

const StyledSidebar = styled.div`
	background-color: ${props => props.theme.colors.primary['800']};
	width: 72px;
	border-right: thin solid ${props => props.theme.colors.neutral[500]};
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: width 0.5s ease-in-out;
	overflow: hidden;

	#sidebarSquareLogo {
		width: 32px;
		height: 32px;
		margin-top: 16px;
	}

	ul > li {
		width: 100%;
		margin: 5px auto;
		> a {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			color: ${props => props.theme.colors.neutral[0]};
			opacity: 0.6;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 3px;
				height: 100%;
				border-radius: 10px;
				background-color: ${props => props.theme.colors.primary[500]};
				opacity: 1;
				transform: scaleY(0);
			}

			&.selected,
			&:hover {
				font-weight: bold;
				opacity: 1;

				&::before {
					transform: scaleY(1);
					transition: transform 0.15s linear;
				}
			}

			> div:first-child {
				cursor: pointer;
				margin-left: 24px;
				svg {
					font-size: 20px;
				}
			}
		}
	}

	@media (max-width: ${props => parseInt(props.theme.breakpoints[2], 10) - 1}px) {
		width: 100%;

		nav {
			height: 100%;
			ul {
				height: 100%;
				display: flex;
				justify-content: space-around;

				> li {
					height: 100%;
					flex-basis: 0;
					flex-grow: 1;
					margin: 0;
					display: flex;
					justify-content: center;
					align-items: center;

					> a {
						height: 100%;
						justify-content: center;

						&::before {
							top: inherit;
							bottom: 0;
							left: 20%;
							width: 60%;
							height: 3px;
							transform: scaleX(0);
						}

						> div:first-child {
							margin: 0;
						}

						&.selected,
						&:hover {
							&::before {
								transform: scaleX(1);
							}
						}
					}
				}
			}
		}
	}
`;

export default StyledSidebar;
