import React from 'react';
import { useUpdateEffect } from '@src/lib/hooks';

type ComponentProps = {
	url: string
	fallbackUrl?: string
	fallbackComponent?: JSX.Element
};

const Image: React.FunctionComponent<ComponentProps> = React.memo(props => {
	const { url, fallbackUrl, fallbackComponent, children } = props;
	const [loadFailed, setLoadFailed] = React.useState(false);
	useUpdateEffect(() => {
		if (url) return setLoadFailed(false);
	}, [url]);

	const showFallback = loadFailed || url === undefined;
	const isFallbackComponent = showFallback && fallbackComponent;
	const isChildren = showFallback && children;
	if (showFallback && fallbackUrl) return <img src={fallbackUrl} alt="" />;
	if (isFallbackComponent || isChildren) return fallbackComponent! || children;

	return <img src={url} onError={e => setLoadFailed(true)} alt="" />;
});

export default Image;
