import { keyframes } from 'styled-components';

const filterChipAnimation = keyframes`
  from {
    transform: scaleX(0) scaleY(0);
    max-width: 0;
  }

  to {
    transform: scaleX(1) scaleY(1);
    max-width: 300px;
  }
`;

export { filterChipAnimation };
