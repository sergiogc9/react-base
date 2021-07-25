const axios = require('axios');
const fs = require('fs');

const API_ACCESS_TOKEN = 'UPDATE_API_TOKEN';
const PROJECT_ID = 'EDIT';
const LOCALES_IDS = {
	en: 'EDIT',
	es: 'EDIT'
};

const updateLanguageLocaleFile = async lang => {
	const localeId = LOCALES_IDS[lang];

	const headers = {
		Authorization: `token ${API_ACCESS_TOKEN}`
	};
	const { data: jsonFileData } = await axios.get(
		`https://api.phrase.com/v2/projects/${PROJECT_ID}/locales/${localeId}/download?file_format=react_nested_json`,
		{
			headers
		}
	);
	fs.writeFileSync(`./src/i18n/locales/${lang}.json`, JSON.stringify(jsonFileData, null, 2));
};

(async () => {
	await Promise.all([updateLanguageLocaleFile('en'), updateLanguageLocaleFile('es')]);
})();
