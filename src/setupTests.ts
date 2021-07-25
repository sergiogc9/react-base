/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import 'jest-styled-components';

// Import i18n to initialize it in all tests and avoid non initialized warnings
import i18n from 'i18n';

jest.mock('i18n', () => {
	const mockedI18n = require('i18next');
	const { initReactI18next } = require('react-i18next');
	const enLocales = require('i18n/locales/en.json');
	const esLocales = require('i18n/locales/es.json');

	const resources = {
		en: { translation: enLocales },
		es: { translation: esLocales }
	};
	mockedI18n.use(initReactI18next).init({ debug: false, lng: 'en', resources });
	return mockedI18n;
});

// Comment next line to see errors in tests
console.error = jest.fn();

// Check i18n initialization
if (!i18n.isInitialized) console.warn('i18n is not initialized!');

class ResizeObserverFake {
	// eslint-disable-next-line @typescript-eslint/ban-types
	constructor(callback: Function) {
		callback();
	}

	// eslint-disable-next-line class-methods-use-this
	observe() {}

	// eslint-disable-next-line class-methods-use-this
	disconnect() {}
}

(window as any).ResizeObserver = ResizeObserverFake;
