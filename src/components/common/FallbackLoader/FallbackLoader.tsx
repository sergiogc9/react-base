import React from 'react';
import { Flex } from '@sergiogc9/react-ui';

import Loading from 'components/ui/Loading';

const FallbackLoader: React.FC = () => {
	const [show, setShow] = React.useState(false);
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		timeoutRef.current = setTimeout(() => setShow(true), 500);

		return () => {
			clearTimeout(timeoutRef.current!);
		};
	}, []);

	if (!show) return null;

	return (
		<Flex width="100%" height="100%" justifyContent="center" alignItems="center">
			<Loading />
		</Flex>
	);
};

export default React.memo(FallbackLoader);
