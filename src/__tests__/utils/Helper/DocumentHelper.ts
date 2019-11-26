import cloneDeep from 'lodash/cloneDeep';

import { DocumentObject, factory } from "@src/class/Document";

const document: DocumentObject = {
	id: "document-id-1",
	title: "Document title",
	content: "Document content",
	queries: [],
	category: "category",
	tags: [],
	place: null,
	date_from_provider: "1992-03-05T06:30:57Z",
	media: { thumb: "fake" },
	image_url: "",
	image: { thumb: "fake" },
	cover: { thumb: "fake", url: "fake" },
	page_number: "",
	brand_associated: "",
	category_id: "",
	country: {
		iso: "es"
	},
	issue_number: "",
	page_occupation: 0,
	author: {
		id: 1506856080,
		name: "Fake name"
	},
	date: "2019-04-04T06:30:57Z",
	language: {
		code: "pt",
		id: "7",
		name: "Portuguese"
	},
	link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
	location: {
		continent: {
			id: "02",
			name: "South America"
		},
		country: {
			id: "0208",
			iso: "BR",
			name: "Brazil"
		}
	},
	provider: "News",
	rank: {
		audience: 1311327,
		similarweb_monthly_visits: 61423055
	},
	social: {},
	source: {
		id: "1233730921",
		title: "http://www.terra.com.br",
		url: "http://www.terra.com.br",
		name: "fake source name"
	},
	company: "Document company",
	line: "Document line"
};

export default {
	getDocument: () => document,
	getPreparedDocument: () => factory(cloneDeep(document))!.prepare()
};
