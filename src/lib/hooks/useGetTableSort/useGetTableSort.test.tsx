import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import storage from 'lib/storage';
import TestUtils from 'lib/tests';
import useGetTableSort from 'lib/hooks/useGetTableSort';

const getComponent = (shouldRemove: boolean = false) => {
	const Component = () => {
		const { onSortChange, sortBy } = useGetTableSort('test', { id: 'id_test', desc: true });

		const onBtnClicked = React.useCallback(() => {
			if (shouldRemove) onSortChange(undefined, undefined);
			else onSortChange('updated_id', false);
		}, [onSortChange]);

		return (
			<div>
				<span>{sortBy.id}</span>
				<span>{sortBy.desc.toString()}</span>
				<button onClick={onBtnClicked}>Click me</button>
			</div>
		);
	};

	return TestUtils.renderWithMockedStore(<Component />);
};

describe('useGetTableSort hook', () => {
	beforeEach(() => {
		storage.clear();
	});

	it('should render default sort if not saved', () => {
		getComponent();

		expect(screen.getByText('id_test')).toBeInTheDocument();
		expect(screen.getByText('true')).toBeInTheDocument();
	});

	it('should render saved sort', () => {
		storage.set('table_sort_test', { id: 'saved_id', desc: false });
		getComponent();

		expect(screen.getByText('saved_id')).toBeInTheDocument();
		expect(screen.getByText('false')).toBeInTheDocument();
	});

	it('should save updated sort', () => {
		getComponent();

		userEvent.click(screen.getByText('Click me'));

		expect(screen.getByText('updated_id')).toBeInTheDocument();
		expect(storage.get('table_sort_test')).toEqual({ id: 'updated_id', desc: false });
	});

	it('should remove updated sort', () => {
		storage.set('table_sort_test', { id: 'saved_id', desc: false });
		getComponent(true);

		expect(storage.get('table_sort_test')).toEqual({ id: 'saved_id', desc: false });

		userEvent.click(screen.getByText('Click me'));

		expect(storage.get('table_sort_test')).toBeNull();
	});
});
