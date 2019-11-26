import i18n from 'i18next';
import { withTranslation, WithTranslation } from 'react-i18next';

import enLocales from '@src/locales/en.json';
import esLocales from '@src/locales/es.json';
import catLocales from '@src/locales/cat.json';

export type LanguageCode = "en" | "es" | "cat";

export const withT = withTranslation(); // no namespace applied, export the function directly if namespace needed
export type TProps = WithTranslation;

i18n.init({
	debug: process.env.NODE_ENV === 'development',
	lng: 'en',
	fallbackLng: 'en',
	resources: {
		en: { translation: enLocales }
	}
});

const _loadedLocales: { [index: string]: true } = {
	en: true
};

export async function setLanguage(lang: LanguageCode) {
	if (i18n.language === lang) return;
	if (!_loadedLocales[lang]) {
		try {
			let langLocales;
			switch (lang) {
				case "es":
					langLocales = esLocales;
					break;
				case "cat":
					langLocales = catLocales;
					break;
					break;
				default:
					langLocales = enLocales;
			}
			_loadedLocales[lang] = true;
			i18n.addResourceBundle(lang, 'translation', langLocales);
		} catch (err) {
			console.error(err, lang);
		}
	}
	i18n.changeLanguage(lang);
}

export default i18n;
