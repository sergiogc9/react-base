import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flex } from '@sergiogc9/react-ui';
import { UserFeedback } from '@sergiogc9/react-ui-collections';

import { FallbackErrorProps } from './types';

const FallbackError: React.FC<FallbackErrorProps> = () => {
	const { t } = useTranslation();

	const onButtonClick = React.useCallback(() => window.location.reload(), []);

	return (
		<Flex
			alignItems="center"
			data-testid="fallbackError"
			height="95vh"
			justifyContent="center"
			maxHeight="100%"
			width="100%"
		>
			<UserFeedback
				buttonText={t('general.error.btn_text')!}
				imageSrc="/assets/images/robot-404.png"
				onButtonClick={onButtonClick}
				text={t('general.error.text')}
				titleText={t('general.error.title_text')}
			/>
		</Flex>
	);
};

export default React.memo(FallbackError);
