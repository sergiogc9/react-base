import { createNameSpacedComponent } from '@sergiogc9/react-utils';
import { Button } from '@sergiogc9/react-ui';

import LinkButtonText from './Text';
import LinkButton from './LinkButton';

export default createNameSpacedComponent(LinkButton, {
	Icon: Button.Icon,
	Text: LinkButtonText
});
