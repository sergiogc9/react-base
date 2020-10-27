import i18n from 'i18n';

import enLocales from 'i18n/locales/en.json';

describe('i18n', () => {
	beforeAll(() => {
		console.log = jest.fn();
	});

	it("should return correct translation", () => {
		expect(i18n.t('api.success')).toBe(enLocales.api.success);
	});
});
