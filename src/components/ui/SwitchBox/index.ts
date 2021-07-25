import { createNameSpacedComponent } from '@sergiogc9/react-utils';

import SwitchBox from './SwitchBox';
import SwitchBoxIcon from './Icon';
import SwitchBoxContent from './Content';

export default createNameSpacedComponent(SwitchBox, {
	Icon: SwitchBoxIcon,
	Content: SwitchBoxContent
});
