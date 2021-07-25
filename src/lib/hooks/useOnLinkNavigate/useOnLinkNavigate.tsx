import React from 'react';
import { useNavigate } from 'react-router';

export type UseOnLinkNavigateArgs = {
	onClick?: (ev: React.MouseEvent<any>) => void;
	replace?: boolean;
	to?: string;
};

const __isRelativeUrl = (url: string) => {
	const regex = new RegExp('^(?:(?:[a-z]+:)?//|(mailto|tel):)', 'i');
	return !regex.test(url);
};

const useOnLinkNavigate = ({ onClick, replace, to }: UseOnLinkNavigateArgs) => {
	const navigate = useNavigate();

	const onLinkClicked = React.useCallback(
		(ev: React.MouseEvent<Element, MouseEvent>) => {
			if (onClick) onClick(ev);
			if (!to) return;
			if (__isRelativeUrl(to)) {
				ev.preventDefault();
				navigate(to, { replace });
			}
		},
		[navigate, onClick, replace, to]
	);

	return onLinkClicked;
};

export default useOnLinkNavigate;
