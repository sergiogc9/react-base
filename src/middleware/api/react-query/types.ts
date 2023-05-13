import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

type CommonConfig = {
	readonly showLoadingBar?: boolean;
};

export type QueryConfig<T> = UseQueryOptions<T, unknown> & CommonConfig;

export type MutationConfig<TResult, TError, TVariables> = UseMutationOptions<TResult, TError, TVariables> &
	CommonConfig;
