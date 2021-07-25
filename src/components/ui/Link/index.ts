import { createNameSpacedComponent } from '@sergiogc9/react-utils';
import { Icon } from '@sergiogc9/react-ui';

import Link from './Link';
import LinkText from './Text';

export default createNameSpacedComponent(Link, {
	Text: LinkText,
	Icon
});
