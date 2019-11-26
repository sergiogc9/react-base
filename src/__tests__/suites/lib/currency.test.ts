import axios from 'axios';

import { convert, getSymbol, setCurrency, convertReverse } from '@src/lib/currency';

const exchangeRates = {
	20190214: 1.3,
	20190215: 0.8,
	20190216: 0.7,
	lastDay: '20190216',
	firstDay: '20190214'
};

const value = 123123675;

describe('currency lib', () => {

	beforeEach(() => {
		return setCurrency('EUR'); // returns promise
	});

	it('should return EUR value', () => {
		expect(convert(value, '20190215')).toEqual(value);
		expect(getSymbol()).toEqual('€');
	});

	it('should set EUR currency', () => {
		setCurrency('EUR');
		expect(convert(value, '20190215')).toEqual(value);
		expect(getSymbol()).toEqual('€');
	});

	it('should set USD currency conversion', done => {
		const mock = jest.spyOn(axios, 'get').mockImplementation(() => new Promise(resolve => resolve({ data: exchangeRates })));
		setCurrency('USD').then(() => {
			expect(mock).toHaveBeenCalled();
			expect(convert(value, '20190215')).toEqual(value * exchangeRates['20190215']);
			expect(getSymbol()).toEqual('$');
			done();
		});
	});

	it('should set GBP currency reverse conversion', done => {
		const mock = jest.spyOn(axios, 'get').mockImplementation(() => new Promise(resolve => resolve({ data: exchangeRates })));
		setCurrency('GBP').then(() => {
			expect(mock).toHaveBeenCalled();
			expect(convertReverse(value, '20190215')).toEqual(value / exchangeRates['20190215']);
			expect(getSymbol()).toEqual('£');
			done();
		});
	});

	it('should use last day entry', done => {
		const mock = jest.spyOn(axios, 'get').mockImplementation(() => new Promise(resolve => resolve({ data: exchangeRates })));
		setCurrency('GBP').then(() => {
			expect(mock).toHaveBeenCalled();
			expect(convert(value, '20190217')).toEqual(value * exchangeRates['20190216']);
			done();
		});
	});

	it('should use first day entry', done => {
		const mock = jest.spyOn(axios, 'get').mockImplementation(() => new Promise(resolve => resolve({ data: exchangeRates })));
		setCurrency('GBP').then(() => {
			expect(mock).toHaveBeenCalled();
			expect(convert(value, '20190213')).toEqual(value * exchangeRates['20190214']);
			done();
		});
	});

});
