export type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};

export type PartialAtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
