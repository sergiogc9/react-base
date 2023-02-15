import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Flex, Link, Text, Title } from '@sergiogc9/react-ui';

import config from 'config';
import { actions } from 'store/ui/counter';
import selectors from 'store/ui/counter/selectors';
import uiSelectors from 'store/ui/selectors';
import { actions as uiActions } from 'store/ui';
import Loading from 'components/ui/Loading';

import Counter from './Counter';

const MainPage: React.FC = () => {
	const { t } = useTranslation();
	const value = useSelector(selectors.getValue);
	const isLoading = useSelector(uiSelectors.getIsFakeLoading);
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(actions.fetchCounterStart(3));
		dispatch(uiActions.fetchDataStart());
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const onSetValue = React.useCallback(
		(val: number) => {
			dispatch(actions.setValue(val));
		},
		[dispatch]
	);

	const onIncrementValue = React.useCallback(() => {
		dispatch(actions.setValue(value + 1));
	}, [dispatch, value]);

	return (
		<Flex alignItems="center" height="100%" id="mainPage" flexDirection="column" justifyContent="center">
			<Text mt={3}>
				Main Page. Edit <code>src/App.tsx</code> and save to reload.
			</Text>
			<Text mt={3}>{t('pages.main.example_text_without_interpolation')}</Text>
			<Text>{t('pages.main.example_text_with_interpolation', { environment: config.environment })}</Text>
			<Link className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer" mt={3}>
				Learn React
			</Link>
			<Flex borderRadius={1} bg="primary.100" flexDirection="column" height={200} p={4} mt={5} width={400}>
				{isLoading && <Loading />}
				{!isLoading && (
					<>
						<Title aspectSize="subtle" mb={3} textAlign="center" width="100%">
							Value: {value}
						</Title>
						<Counter defaultValue={value} onIncrement={onIncrementValue} onSetValue={onSetValue} />
					</>
				)}
			</Flex>
		</Flex>
	);
};

export default React.memo(MainPage);
