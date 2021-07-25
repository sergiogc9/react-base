import { createNameSpacedComponent } from '@sergiogc9/react-utils';

import HoverContent from './Content';
import Hover from './Hover';

export default createNameSpacedComponent(Hover, {
	Content: HoverContent
});
