import cloneDeep from 'lodash/cloneDeep';

import defaultAuthor from './author';
import defaultBook from './book';

const _get = <E>(defaultEntity: E, override?: Partial<E>): E => {
	const entity = cloneDeep(defaultEntity);
	if (override) Object.assign(entity, override);
	return entity;
};

// helper to simplify function creation
const get = <E>(defaultEntity: E) => (override?: Partial<typeof defaultEntity>) => _get(defaultEntity, override);

export const getAuthor = get(defaultAuthor);
export const getBook = get(defaultBook);
