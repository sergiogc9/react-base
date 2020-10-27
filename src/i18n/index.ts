import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import config from 'config';
import enLocales from './locales/en.json';
import esLocales from './locales/es.json';

const resources = {
	en: { translation: enLocales },
	es: { translation: esLocales }
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: config.isDevelopmentEnvironment(),
		resources,
		fallbackLng: 'en'
	});

export default i18n;
