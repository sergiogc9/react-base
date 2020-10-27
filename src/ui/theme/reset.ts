import { css } from 'styled-components';

// Default reset configuration recommended for use along applications
const reset = css`
	* {
		  outline: none;
	}
	/* Box sizing rules */
	*,
	*::before,
	*::after {
		  box-sizing: border-box;
	}

	a {
		  text-decoration: none;
		  color: inherit;
	}

	/* Remove default padding */
	ul,
	ol {
		  padding: 0;
	}

	html {
		/* This defines what 1rem is */
		font-size: 62.5%; /* 1 rem = 10px; 10px/16px = 62.5% */

		${props => css`
			@media (max-width: ${props.theme.breakpoints.values.md}) {
				font-size: 56.25%; /* 1 rem = 9px, 9/16 = 56.25% */
			}

			@media (max-width: ${props.theme.breakpoints.values.sm}) {
				font-size: 50%; /* 1 rem = 8px, 8/16 = 50% */
			}
		`}
	}

	/* Remove default margin */
	body,
	h1,
	h2,
	h3,
	h4,
	p,
	ul,
	ol,
	li,
	figure,
	figcaption,
	blockquote,
	dl,
	dd {
		  margin: 0;
	}

	/* Set core body defaults */
	body {
		  min-height: 100vh;
		  scroll-behavior: smooth;
		  text-rendering: optimizeSpeed;
		  line-height: 1.5;
	}

	/* Remove list styles on ul, ol elements with a class attribute */
	ul,
	ol {
		  list-style: none;
	}

	/* Make images easier to work with */
	img {
		  max-width: 100%;
		  display: block;
	}

	/* Inherit fonts for inputs and buttons */
	input,
	button,
	textarea,
	select {
		  font: inherit;
	}

	/* Remove all animations and transitions for people that prefer not to see them */
	@media (prefers-reduced-motion: reduce) {
		* {
		    animation-duration: 0.01ms !important;
	    	animation-iteration-count: 1 !important;
	    	transition-duration: 0.01ms !important;
	    	scroll-behavior: auto !important;
		}
	}
`;

export default reset;
