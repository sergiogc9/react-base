import { Filter, FilterField } from '..';
import FiltersFactory from '.';

const filter: Filter = { condition: 'contains', field: 'fake_text', id: 'fake-id', type: 'text', value: 'Awesome' };
const field: FilterField = { field: 'fake_text', text: 'Awesome', type: 'text' };

describe('FiltersFactory', () => {
	it('should return a boolean filter using filter data', () => {
		expect(FiltersFactory.getFilter({ ...filter, type: 'boolean' } as any, [field]).getFilterData().type).toBe(
			'boolean'
		);
	});

	it('should return a boolean filter using a field', () => {
		expect(FiltersFactory.getFilter({ ...field, type: 'boolean' } as any, [field]).getFilterData().type).toBe(
			'boolean'
		);
	});

	it('should return a date filter using filter data', () => {
		expect(FiltersFactory.getFilter({ ...filter, type: 'date' } as any, [field]).getFilterData().type).toBe('date');
	});

	it('should return a date filter using a field', () => {
		expect(FiltersFactory.getFilter({ ...field, type: 'date' } as any, [field]).getFilterData().type).toBe('date');
	});

	it('should return a select filter using filter data', () => {
		expect(FiltersFactory.getFilter({ ...filter, type: 'select' } as any, [field]).getFilterData().type).toBe('select');
	});

	it('should return a select filter using a field', () => {
		expect(FiltersFactory.getFilter({ ...field, type: 'select' } as any, [field]).getFilterData().type).toBe('select');
	});

	it('should return a multi select filter using filter data', () => {
		expect(FiltersFactory.getFilter({ ...filter, type: 'multi_select' } as any, [field]).getFilterData().type).toBe(
			'multi_select'
		);
	});

	it('should return a multi select filter using a field', () => {
		expect(FiltersFactory.getFilter({ ...field, type: 'multi_select' } as any, [field]).getFilterData().type).toBe(
			'multi_select'
		);
	});

	it('should return a number filter using filter data', () => {
		expect(FiltersFactory.getFilter({ ...filter, type: 'number' } as any, [field]).getFilterData().type).toBe('number');
	});

	it('should return a number filter using a field', () => {
		expect(FiltersFactory.getFilter({ ...field, type: 'number' } as any, [field]).getFilterData().type).toBe('number');
	});

	it('should return a text filter using filter data', () => {
		expect(FiltersFactory.getFilter({ ...filter, type: 'text' } as any, [field]).getFilterData().type).toBe('text');
	});

	it('should return a text filter using a field', () => {
		expect(FiltersFactory.getFilter({ ...field, type: 'text' }, [field]).getFilterData().type).toBe('text');
	});
});
