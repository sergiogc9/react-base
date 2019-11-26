import format, { setTenantSettings, setUserSettings } from '@src/lib/format';
import { setLanguage } from '@src/lib/i18n';

// TOFIX Number.toLocaleString does not work on node

describe('format', () => {

	describe('number', () => {

		const counters = {
			audience: {
				followers: 1234
			},
			reach: {
				followers: 5678
			},
			echo: {
				likes: 9123,
				replies: 4567
			}
		};

		const doc = {
			counters: {
				audience: 1234567,
				miv: 12345
			},
			date: '20190215'
		};

		beforeEach(() => {
			setUserSettings({ timezone: 'UTC', locale: 'es-ES' });
			setTenantSettings({ valuation_metric: 'miv', currency: 'EUR' });
		});

		it('metric', () => {
			expect(format.number.metric(0)).toEqual('0');
			expect(format.number.metric(12345)).toEqual('12K');
			// TOFIX
			// expect(format.number.metric(12345678)).toEqual('12,3M');
			// expect(format.number.metric(12345, 1)).toEqual('12,3K');
			// expect(format.number.metric(12345678, 1)).toEqual('12,3M');
			// expect(format.number.metric(123456789, 1)).toEqual('123,5M');
			// TODELETE
			expect(format.number.metric(12345678)).toEqual('12.3M');
			expect(format.number.metric(12345, 1)).toEqual('12.3K');
			expect(format.number.metric(12345678, 1)).toEqual('12.3M');
			expect(format.number.metric(123456789, 1)).toEqual('123.5M');
		});

		// TOFIX
		// it('locale', () => {
		// 	expect(format.number.locale(0)).toEqual('0');
		// 	expect(format.number.locale(12345)).toEqual('12.345');
		// 	expect(format.number.locale(12345678)).toEqual('12.345.678');
		// 	expect(format.number.locale(12345678.9)).toEqual('12.345.678,9');
		// 	setUserSettings({ timezone: 'UTC', locale: 'en-GB' });
		// 	expect(format.number.locale(12345)).toEqual('12,345');
		// 	expect(format.number.locale(12345678)).toEqual('12,345,678');
		// 	expect(format.number.locale(12345678.9)).toEqual('12,345,678.9');
		// });

		it('counter', () => {
			setTenantSettings({valuation_metric: 'miv'});
			expect(format.number.counter(counters, 'reach')).toEqual('6K');
			expect(format.number.counter(counters, 'audience')).toEqual('6K'); // if miv gets reach
		});

		it('currency', () => {
			setTenantSettings({currency: 'EUR'});
			expect(format.number.currency(doc.counters, doc.date)).toEqual('€12K');
			// expect(format.number.currency(doc, 'locale')).toEqual('€1.234.567'); // TOFIX
			expect(format.number.currency(doc.counters, doc.date, 'locale')).toEqual('Media Impact Value™: €12K'); // TODELTE
			expect(format.number.currency({ audience: 0 }, doc.date)).toEqual('');
		});

	});

	describe('text', () => {

		const counters = {
			audience: {
				followers: 1234
			},
			reach: {
				followers: 5678
			},
			echo: {
				likes: 9123,
				replies: 4567
			}
		};

		beforeEach(() => {
			setLanguage('en');
		});

		it('counter', () => {
			expect(format.text.counter(counters, 'reach')).toEqual('Reach/Subscribers: 6K followers');
			expect(format.text.counter(counters, 'audience')).toEqual('Reach/Subscribers: 6K followers'); // if miv gets reach
		});
	});

	describe('date', () => {

		const date = '2019-02-15T00:00:00';

		beforeEach(() => {
			setUserSettings({ timezone: 'UTC', locale: 'es-ES' });
		});

		it('doc', () => {
			expect(format.date.doc(date)).toEqual('feb. 14');
			setUserSettings({ timezone: 'Europe/Andorra', locale: 'fr-FR' });
			expect(format.date.doc(date)).toEqual('févr. 15');
		});
		it('locale', () => {
			expect(format.date.locale(date)).toEqual('14/02/2019');
			setUserSettings({ timezone: 'UTC', locale: 'en-US' });
			expect(format.date.locale(date)).toEqual('02/14/2019');
		});
		it('localeTitle', () => {
			expect(format.date.localeTitle(date)).toEqual('jueves, 14 de febrero de 2019 23:00');
			setUserSettings({ timezone: 'UTC', locale: 'en-GB' });
			expect(format.date.localeTitle(date)).toEqual('Thursday, 14 February 2019 23:00');
		});
	});

});
