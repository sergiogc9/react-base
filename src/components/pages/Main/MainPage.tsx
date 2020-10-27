import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import config from 'config';
import { actions } from 'store/ui/counter';
import selectors from 'store/ui/counter/selectors';
import uiSelectors from 'store/ui/selectors';
import { actions as uiActions } from 'store/ui';
import Counter from 'components/pages/Main/Counter';

const MainPage: React.FC = () => {
	const { t } = useTranslation();
	const value = useSelector(selectors.getValue);
	const loading = useSelector(uiSelectors.getLoading);
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(actions.fetchCounterStart(3));
		dispatch(uiActions.fetchDataStart());
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const onSetValue = React.useCallback((val: number) => {
		dispatch(actions.setValue(val));
	}, [dispatch]);

	const onIncrementValue = React.useCallback(() => {
		dispatch(actions.setValue(value + 1));
	}, [dispatch, value]);

	return (
		<div id="mainPage">
			<header className="App-header">
				<p>
					{t('example_text_without_interpolation')}
				</p>
				<p>
					{t('example_text_with_interpolation', { environment: config.environment })}
				</p>
				<p>
					Main Page. Edit <code>src/App.tsx</code> and save to reload.
        		</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
        		</a>
			</header>
			<main>
				{!loading && <span>Value: {value}</span>}
				<Counter defaultValue={value} onIncrement={onIncrementValue} onSetValue={onSetValue} />
			</main>
		</div>
	);
};

export default React.memo(MainPage);
