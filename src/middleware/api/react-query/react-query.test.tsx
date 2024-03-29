import React from 'react';
import { waitFor } from '@testing-library/react';
import MockDate from 'mockdate';
import { QueryFunction, QueryKey } from '@tanstack/react-query';

import TestUtils from 'lib/tests';
import { actions } from 'store/notifications';
import { store } from 'store';

import { useApiMutate, useApiQuery } from '.';
import { MutationConfig, QueryConfig } from './types';

jest.mock('config/api/success', () => ({
	reactQuery: {
		test: {
			getPokemon: {
				text: 'Success raw text',
				level: 'success'
			}
		}
	}
}));

jest.mock('config/api/error', () => ({
	reactQuery: {
		test: {
			getPokemon: {
				text: 'Error raw text',
				level: 'error'
			},
			actionWithoutErrorNotification: false
		}
	}
}));

// eslint-disable-next-line no-console
const consoleError = console.error;
const fn = async () => Promise.resolve([]);
// eslint-disable-next-line prefer-promise-reject-errors
const errorFn = async () => Promise.reject({ code: '400' });

describe('Api response middleware', () => {
	const getComponentWithQuery = (
		actionKey: string,
		queryKey: QueryKey,
		queryFn: QueryFunction<any>,
		queryConfig?: QueryConfig<any>
	) => {
		const Component = () => {
			const { data } = useApiQuery(actionKey, queryKey, queryFn, queryConfig);

			return <div>{data}</div>;
		};
		return TestUtils.renderWithStore(<Component />);
	};

	const getComponentWithMutation = (
		actionKey: string,
		queryFn: QueryFunction<any>,
		mutateConfig?: MutationConfig<any, any, any>
	) => {
		const Component = () => {
			const { mutate } = useApiMutate<any, any, any>(actionKey, queryFn, mutateConfig);

			React.useEffect(() => {
				mutate({});
			}, [mutate]);

			return <div />;
		};
		return TestUtils.renderWithStore(<Component />);
	};

	beforeAll(() => {
		Math.random = () => 0.12345;
		MockDate.set(123456789);
		// eslint-disable-next-line no-console
		console.error = jest.fn();
	});

	afterAll(() => {
		// eslint-disable-next-line no-console
		console.error = consoleError;
	});

	afterEach(() => {
		store.dispatch(actions.removeNotification('123456789123450'));
	});

	it('should show success notification', async () => {
		getComponentWithQuery('test/getPokemon', ['pokemon'], fn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Success raw text'));
	});

	it('should not show success notification', async () => {
		getComponentWithQuery('test/actionWithoutSuccessNotification', ['pokemon'], fn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe(undefined));
	});

	it('should show call on success function passed by parameter', async () => {
		const onSuccessFn = jest.fn();
		getComponentWithQuery('test/getPokemon', ['pokemon'], fn, {
			onSuccess: onSuccessFn
		});
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Success raw text'));
		expect(onSuccessFn).toHaveBeenCalledTimes(1);
	});

	it('should show error notification', async () => {
		getComponentWithQuery('test/getPokemon', ['pokemon'], errorFn, {
			retry: false
		});
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Error raw text'));
	});

	it('should not show error notification', async () => {
		getComponentWithQuery('test/actionWithoutErrorNotification', ['pokemon'], errorFn, { retry: false });
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe(undefined));
	});

	it('should show call on error function passed by parameter', async () => {
		const onErrorFn = jest.fn();
		getComponentWithQuery('test/getPokemon', ['pokemon'], errorFn, {
			retry: false,
			onError: onErrorFn
		});
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Error raw text'));
		expect(onErrorFn).toHaveBeenCalledTimes(1);
	});

	it('should show success notification with mutate', async () => {
		getComponentWithMutation('test/getPokemon', fn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Success raw text'));
	});

	it('should not show success notification with mutate', async () => {
		getComponentWithMutation('test/actionWithoutSuccessNotification', fn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe(undefined));
	});

	it('should show call on success function passed by parameter with mutate', async () => {
		const onSuccessFn = jest.fn();
		getComponentWithMutation('test/getPokemon', fn, { onSuccess: onSuccessFn });
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Success raw text'));
		expect(onSuccessFn).toHaveBeenCalledTimes(1);
	});

	it('should show error notification with mutate', async () => {
		getComponentWithMutation('test/getPokemon', errorFn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Error raw text'));
	});

	it('should not show error notification with mutate', async () => {
		getComponentWithMutation('test/actionWithoutErrorNotification', errorFn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe(undefined));
	});

	it('should show call on error function passed by parameter with mutate', async () => {
		const onErrorFn = jest.fn();
		getComponentWithMutation('test/getPokemon', errorFn, {
			onError: onErrorFn
		});
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Error raw text'));
		expect(onErrorFn).toHaveBeenCalledTimes(1);
	});

	it('should show and hide loading bar in query', async () => {
		getComponentWithQuery('test', ['test'], fn, { showLoadingBar: true });

		expect(store.getState().ui._.pendingLoadingBarApiCalls).toBe(1);

		await waitFor(() => expect(store.getState().ui._.pendingLoadingBarApiCalls).toBe(0));
	});

	// eslint-disable-next-line jest/no-commented-out-tests
	// it('should show and hide loading bar in mutate', async () => {
	// 	getComponentWithMutation('test', async () => new Promise(resolve => setTimeout(resolve, 300)), {
	// 		showLoadingBar: true
	// 	});

	// 	await waitFor(() => expect(store.getState().ui._.pendingLoadingBarApiCalls).toBe(1));

	// 	await waitFor(() => expect(store.getState().ui._.pendingLoadingBarApiCalls).toBe(0));
	// });

	// eslint-disable-next-line jest/no-commented-out-tests
	// it('should show and hide loading bar in mutate error', async () => {
	// 	getComponentWithMutation('test', async () => new Promise((_, reject) => setTimeout(reject, 300)), {
	// 		showLoadingBar: true
	// 	});

	// 	await waitFor(() => expect(store.getState().ui._.pendingLoadingBarApiCalls).toBe(1));

	// 	await waitFor(() => expect(store.getState().ui._.pendingLoadingBarApiCalls).toBe(0));
	// });
});
