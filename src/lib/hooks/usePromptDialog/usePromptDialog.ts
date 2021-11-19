import React from 'react';
import { UNSAFE_NavigationContext } from 'react-router';

import { PromptDialogProps, UnblockFunction } from './types';

const usePromptDialog: PromptDialogProps = (isEnabled, dialogText) => {
	const navigationContext = React.useContext(UNSAFE_NavigationContext);

	const unblockRef = React.useRef<UnblockFunction>(null);

	React.useEffect(() => {
		if (isEnabled) {
			unblockRef.current = navigationContext.navigator.block(tx => {
				if (window.confirm(dialogText)) {
					unblockRef.current!();

					tx.retry();
				}
			});
		} else if (unblockRef.current) {
			unblockRef.current();
		}
		return () => {
			if (unblockRef.current) unblockRef.current();
		};
	}, [dialogText, isEnabled, navigationContext.navigator]);
};

export default usePromptDialog;
