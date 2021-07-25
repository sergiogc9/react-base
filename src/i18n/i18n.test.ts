import i18n from 'i18n';

import enLocales from 'i18n/locales/en.json';
import esLocales from 'i18n/locales/es.json';

jest.unmock('i18n');

describe('i18n', () => {
	beforeAll(() => {
		// eslint-disable-next-line no-console
		console.log = jest.fn();
	});

	it('should return correct translation', () => {
		expect(i18n.t('form.error.input_required')).toBe(enLocales.form.error.input_required);
		expect(i18n.t('form.error.input_required', { lng: 'es' })).toBe(esLocales.form.error.input_required);
	});
});
