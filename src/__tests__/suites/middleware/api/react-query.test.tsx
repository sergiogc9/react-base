import React from 'react';
import { render, waitFor } from "@testing-library/react";
import MockDate from 'mockdate';

import { actions } from 'store/notifications';
import { useApiQuery } from "middleware/api/react-query";
import { QueryConfig, QueryKey, TypedQueryFunction } from 'react-query';
import { store } from 'store';

jest.mock('config/api/success', () => (
	{
		reactQuery: {
			test: {
				getPokemon: {
					text: "Success raw text",
					level: "success"
				}
			}
		}
	}
));

jest.mock('config/api/error', () => (
	{
		reactQuery: {
			test: {
				getPokemon: {
					text: "Error raw text",
					level: "error"
				},
				actionWithoutErrorNotification: false
			}
		}
	}
));

const consoleError = console.error;
const fn = async () => Promise.resolve([]);
const errorFn = async () => Promise.reject({ code: '400' });

describe("Api response middleware", () => {

	const getComponentWithQuery = (actionKey: string, queryKey: QueryKey, queryFn: TypedQueryFunction<any>, queryConfig?: QueryConfig<any, unknown>) => {
		const Component = () => {
			const { data } = useApiQuery(actionKey, queryKey, queryFn, queryConfig);

			return <div>{data}</div>;
		};
		return render(<Component />);
	};

	beforeAll(() => {
		Math.random = () => 0.12345;
		MockDate.set(123456789);
		console.error = jest.fn();
	});

	afterAll(() => {
		console.error = consoleError;
	});

	afterEach(() => {
		store.dispatch(actions.removeNotification('123456789123450'));
	});

	it("should show success notification", async () => {
		getComponentWithQuery('test/getPokemon', 'pokemon', fn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Success raw text'));
	});

	it("should not show success notification", async () => {
		getComponentWithQuery('test/actionWithoutSuccessNotification', 'pokemon', fn);
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe(undefined));
	});

	it("should show call on success function passed by parameter", async () => {
		const onSuccessFn = jest.fn();
		getComponentWithQuery('test/getPokemon', 'pokemon', fn, { onSuccess: onSuccessFn });
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Success raw text'));
		expect(onSuccessFn).toHaveBeenCalledTimes(1);
	});

	it("should show error notification", async () => {
		getComponentWithQuery('test/getPokemon', 'pokemon', errorFn, { retry: false });
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Error raw text'));
	});

	it("should not show error notification", async () => {
		getComponentWithQuery('test/actionWithoutErrorNotification', 'pokemon', errorFn, { retry: false });
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe(undefined));
	});

	it("should show call on error function passed by parameter", async () => {
		const onErrorFn = jest.fn();
		getComponentWithQuery('test/getPokemon', 'pokemon', errorFn, { retry: false, onError: onErrorFn });
		await waitFor(() => expect(store.getState().notifications.items[123456789123450]?.text).toBe('Error raw text'));
		expect(onErrorFn).toHaveBeenCalledTimes(1);
	});
});
