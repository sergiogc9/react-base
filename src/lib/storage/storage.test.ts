import { DateTime } from 'luxon';

import storage from 'lib/storage';

describe('Storage lib', () => {
	it('should set a value into storage', () => {
		storage.set('test', { nice: 'awesome' });
		expect(localStorage.getItem('test')).toEqual(JSON.stringify({ value: { nice: 'awesome' } }));
	});

	it('should set a value into storage with expiry date', () => {
		const now = DateTime.now().plus({ day: 1 });
		storage.set('test', { nice: 'awesome' }, now.toJSDate());
		expect(localStorage.getItem('test')).toEqual(
			JSON.stringify({ value: { nice: 'awesome' }, expiresAt: now.toISO() })
		);
	});

	it('should get an existing value into storage', () => {
		expect(storage.get('test')).toEqual({ nice: 'awesome' });
	});

	it('should get null value if not exists', () => {
		expect(storage.get('test-wrong')).toBe(null);
	});

	it('should get null value is expired', () => {
		const expiredDate = DateTime.now().minus({ day: 1 });
		storage.set('test-expired', { nice: 'awesome' }, expiredDate.toJSDate());
		expect(storage.get('test-expired')).toEqual(null);
	});

	it('should return has as true if exists', () => {
		expect(storage.has('test')).toBe(true);
	});

	it('should return has as false if not exists', () => {
		expect(storage.has('test-wrong')).toBe(false);
	});

	it('should return has as false if value is expired', () => {
		const expiredDate = DateTime.now().minus({ day: 1 });
		storage.set('test-expired', { nice: 'awesome' }, expiredDate.toJSDate());
		expect(storage.has('test-expired')).toEqual(false);
	});

	it('should remove value successfully', () => {
		storage.set('remove-test', 'awesome');
		expect(storage.has('remove-test')).toBe(true);
		storage.remove('remove-test');
		expect(storage.has('remove-test')).toBe(false);
	});

	it('should clear all values successfully', () => {
		storage.set('remove-test-1', 'awesome1');
		storage.set('remove-test-2', 'awesome2');
		storage.set('remove-test-3', 'awesome3');
		expect(storage.has('remove-test-1')).toBe(true);
		expect(storage.has('remove-test-2')).toBe(true);
		expect(storage.has('remove-test-2')).toBe(true);
		storage.clear();
		expect(storage.has('remove-test-1')).toBe(false);
		expect(storage.has('remove-test-2')).toBe(false);
		expect(storage.has('remove-test-2')).toBe(false);
	});

	it('should receive on change key event', () => {
		const mockHandler = jest.fn();
		storage.onKeyChange('changing-key', mockHandler);
		storage.set('changing-key', 'fake');
		expect(mockHandler).toHaveBeenCalled();
	});
});
