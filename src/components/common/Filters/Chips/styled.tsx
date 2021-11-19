import styled, { keyframes } from 'styled-components';
import { Animation, BaseAnimationProps } from '@sergiogc9/react-ui';

const StyledFilterChips: React.FC<BaseAnimationProps> = styled(Animation.BaseAnimation)<BaseAnimationProps>`
	::-webkit-scrollbar {
		display: none;
	}
`;

StyledFilterChips.defaultProps = {};

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

const filterChipWrapperAnimation = keyframes`
  from {
    max-height: 0;
    padding-top: 0px;
  }

  80% {
    padding-top: 32px;
  }

  to {
    max-height: 200px;
    padding-top: 32px;
  }
`;

export { filterChipAnimation, filterChipWrapperAnimation };
export default StyledFilterChips;
