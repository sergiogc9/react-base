import { DocumentObject, ApiSearchDocument, Document, factory, ApiArticleSearchDocument, ApiPreviewSearchDocument } from '@src/class/Document';
import cloneDeep from 'lodash/cloneDeep';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

describe('Document class', () => {

	const document = TestHelper.getDocument();

	it('should create a new article DocumentObject', () => {

		const apiSearchDocument: ApiArticleSearchDocument = {
			id: "document-id-1",
			source: {
				queries: ["query"],
				tags: ["tag"],
				categories_id: "categoryId"
			}
		};
		const documentObjectCreated: DocumentObject = DocumentObject.create(document, apiSearchDocument);
		expect(documentObjectCreated).toEqual(
			{
				...document,
				queries: apiSearchDocument.source.queries,
				tags: apiSearchDocument.source.tags,
				category: apiSearchDocument.source.categories_id
			}
		);
	});

	it('should create a new preview DocumentObject', () => {

		const apiSearchDocument: ApiPreviewSearchDocument = "15543594571385654087";
		const documentObjectCreated: DocumentObject = DocumentObject.create(document, apiSearchDocument);
		expect(documentObjectCreated).toEqual(
			{
				...document
			}
		);
	});

	it('should create a new OnlineDocument', () => {

		const onlineDocument: Document | null = factory(cloneDeep(document));
		expect(onlineDocument).toEqual(
			{
				_ranges: [{ decimal: 1, divider: 1000000, suffix: "M" }, { decimal: 0, divider: 1000, suffix: "K" }],
				author: { id: 1506856080, name: "Fake name" },
				brand_associated: "",
				company: "Document company",
				category: "category",
				category_id: "",
				content: "Document content",
				country: { iso: "es" },
				date: "2019-04-04T06:30:57Z",
				date_from_provider: "1992-03-05T06:30:57Z",
				id: "document-id-1",
				image: { thumb: "fake" },
				image_url: "",
				cover: { thumb: "fake", url: "fake" },
				issue_number: "",
				language: { code: "pt", id: "7", name: "Portuguese" },
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				line: "Document line",
				location: {
					continent: { id: "02", name: "South America" },
					country: { id: "0208", iso: "BR", name: "Brazil" }
				},
				media: { thumb: "fake" },
				page_number: "",
				page_occupation: 0,
				place: null,
				provider: "News",
				queries: [],
				rank: { audience: 1311327, similarweb_monthly_visits: 61423055 },
				social: {},
				source: { id: "1233730921", name: "fake source name", title: "http://www.terra.com.br", url: "http://www.terra.com.br" },
				tags: [],
				title: "Document title"
			}
		);

		expect(onlineDocument!.prepare()).toEqual(
			{
				author_icon: "https://faviewhaiy.s3.amazonaws.com/1/1233730921.ico",
				author_link: "http://www.terra.com.br",
				author_name: "http://www.terra.com.br",
				categories_id: "category",
				content: "Document content",
				counters: {
					echo: { title: "", value: "" },
					engagement: { title: "Engagement/Views: 0 shares", value: "0" },
					reach: { title: "Reach/Subscribers: 61.4M visitors", value: "61.4M" }
				},
				country: "BR",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-news",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "News",
				tags: undefined,
				title: "Document title"
			}
		);

		onlineDocument!.date_from_provider = "";
		onlineDocument!.media.image = ["fake image"];
		onlineDocument!.rank!.audience = 0;
		onlineDocument!.social!.shares = "";
		onlineDocument!.rank!.similarweb_monthly_visits = 0;
		expect(onlineDocument!.prepare()).toEqual(
			{
				author_icon: "https://faviewhaiy.s3.amazonaws.com/1/1233730921.ico",
				author_link: "http://www.terra.com.br",
				author_name: "http://www.terra.com.br",
				categories_id: "category",
				content: "Document content",
				counters: {
					echo: { title: "", value: "" },
					engagement: { title: "Engagement/Views: 0 shares", value: "0" },
					reach: { title: "Reach/Subscribers: 0 visitors", value: "0" }
				},
				country: "BR",
				date: "Apr 04",
				dateTitle: "Thursday, April 4, 2019 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-news",
				id: "document-id-1",
				image: "fake image",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "News",
				tags: undefined,
				title: "Document title"
			}
		);
		onlineDocument!.social = null;
		onlineDocument!.rank = {};
		onlineDocument!.media.image = [];
		expect(onlineDocument!.prepare()).toEqual(
			{
				author_icon: "https://faviewhaiy.s3.amazonaws.com/1/1233730921.ico",
				author_link: "http://www.terra.com.br",
				author_name: "http://www.terra.com.br",
				categories_id: "category",
				content: "Document content",
				counters: {
					echo: { title: "", value: "" },
					engagement: { title: "Engagement/Views: 0 shares", value: "0" },
					reach: { title: "Reach/Subscribers: 0 visitors", value: "0" }
				},
				country: "BR",
				date: "Apr 04",
				dateTitle: "Thursday, April 4, 2019 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-news",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "News",
				tags: undefined,
				title: "Document title"
			}
		);
	});

	it('should create a new PrintDocument', () => {

		const printDocumentSource = cloneDeep(document);

		printDocumentSource.provider = "Print";
		printDocumentSource.brand_associated = "Brand Associated";
		printDocumentSource.page_occupation = 20;
		printDocumentSource.page_number = '10';
		printDocumentSource.issue_number = '30';

		const printDocument: Document | null = factory(printDocumentSource);
		expect(printDocument).toEqual(
			{
				_ranges: [{ decimal: 1, divider: 1000000, suffix: "M" }, { decimal: 0, divider: 1000, suffix: "K" }],
				author: { id: 1506856080, name: "Fake name" },
				brand_associated: "Brand Associated",
				category: "category",
				category_id: "",
				content: "Document content",
				company: "Document company",
				country: { iso: "es" },
				date: "2019-04-04T06:30:57Z",
				date_from_provider: "1992-03-05T06:30:57Z",
				id: "document-id-1",
				image: { thumb: "fake" },
				image_url: "",
				cover: { thumb: "fake", url: "fake" },
				issue_number: "30",
				language: { code: "pt", id: "7", name: "Portuguese" },
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				line: "Document line",
				location: {
					continent: { id: "02", name: "South America" },
					country: { id: "0208", iso: "BR", name: "Brazil" }
				},
				media: { thumb: "fake" },
				page_number: "10",
				page_occupation: 20,
				place: null,
				provider: "Print",
				queries: [],
				rank: { audience: 1311327, similarweb_monthly_visits: 61423055 },
				social: {},
				source: { id: "1233730921", name: "fake source name", title: "http://www.terra.com.br", url: "http://www.terra.com.br" },
				tags: [],
				title: "Document title"
			}
		);

		expect(printDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "fake source name",
				categories_id: "category",
				content: "Brand <span class=\"bold\">Brand Associated</span> - Product <span class=\"bold\">filters.categories.</span> </br> Page 10, Issue 30, 2000% of page occupation",
				counters: {
					engagement: { title: "Engagement/Views: 0", value: "0" },
					reach: { title: "Reach/Subscribers: 1.3M visitors", value: "1.3M" },
					echo: { title: "", value: "" }
				},
				country: "es",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-print",
				id: "document-id-1",
				image: "fake",
				cover: "fake",
				cover_link: "fake",
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Print",
				tags: undefined,
				title: "Document content"
			}
		);

		printDocument!.rank!.audience = 0;
		printDocument!.content = "";
		printDocument!.date_from_provider = "";
		printDocument!.media.image = ["fake image"];
		printDocument!.image.thumb = null;
		expect(printDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "fake source name",
				categories_id: "category",
				content: "Brand <span class=\"bold\">Brand Associated</span> - Product <span class=\"bold\">filters.categories.</span> </br> Page 10, Issue 30, 2000% of page occupation",
				counters: {
					engagement: { title: "Engagement/Views: 0", value: "0" },
					reach: { title: "Reach/Subscribers: 0 visitors", value: "0" },
					echo: { title: "", value: "" }
				},
				country: "es",
				date: "Apr 04",
				dateTitle: "Thursday, April 4, 2019 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-print",
				id: "document-id-1",
				image: "",
				cover: "fake",
				cover_link: "fake",
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Print",
				tags: undefined,
				title: "fake source name"
			}
		);

		printDocument!.rank = {};
		printDocument!.social = null;
		expect(printDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "fake source name",
				categories_id: "category",
				content: "Brand <span class=\"bold\">Brand Associated</span> - Product <span class=\"bold\">filters.categories.</span> </br> Page 10, Issue 30, 2000% of page occupation",
				counters: {
					engagement: { title: "Engagement/Views: 0", value: "0" },
					reach: { title: "Reach/Subscribers: 0 visitors", value: "0" },
					echo: { title: "", value: "" }
				},
				country: "es",
				date: "Apr 04",
				dateTitle: "Thursday, April 4, 2019 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-print",
				id: "document-id-1",
				image: "",
				cover: "fake",
				cover_link: "fake",
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Print",
				tags: undefined,
				title: "fake source name"
			}
		);

		printDocument!.page_number = '';
		printDocument!.issue_number = '';
		expect(printDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "fake source name",
				categories_id: "category",
				content: "Brand <span class=\"bold\">Brand Associated</span> - Product <span class=\"bold\">filters.categories.</span> </br> Page -, Issue -, 2000% of page occupation",
				counters: {
					engagement: { title: "Engagement/Views: 0", value: "0" },
					reach: { title: "Reach/Subscribers: 0 visitors", value: "0" },
					echo: { title: "", value: "" }
				},
				country: "es",
				date: "Apr 04",
				dateTitle: "Thursday, April 4, 2019 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-print",
				id: "document-id-1",
				image: "",
				cover: "fake",
				cover_link: "fake",
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Print",
				tags: undefined,
				title: "fake source name"
			}
		);
	});

	it('should create a new TwitterDocument', () => {

		const twitterDocumentSource = cloneDeep(document);

		twitterDocumentSource.provider = "Twitter";
		twitterDocumentSource.place = {};
		twitterDocumentSource.place.country_code = "ES";

		const twitterDocument: Document | null = factory(twitterDocumentSource);
		expect(twitterDocument).toEqual(
			{
				_ranges: [{ decimal: 1, divider: 1000000, suffix: "M" }, { decimal: 0, divider: 1000, suffix: "K" }],
				author: { id: 1506856080, name: "Fake name" },
				brand_associated: "",
				company: "Document company",
				category: "category",
				category_id: "",
				content: "Document content",
				country: { iso: "es" },
				date: "2019-04-04T06:30:57Z",
				date_from_provider: "1992-03-05T06:30:57Z",
				id: "document-id-1",
				image: { thumb: "fake" },
				image_url: "",
				cover: { thumb: "fake", url: "fake" },
				issue_number: "",
				language: { code: "pt", id: "7", name: "Portuguese" },
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				line: "Document line",
				location: {
					continent: { id: "02", name: "South America" },
					country: { id: "0208", iso: "BR", name: "Brazil" }
				},
				media: { thumb: "fake" },
				page_number: "",
				page_occupation: 0,
				place: {
					country_code: "ES"
				},
				provider: "Twitter",
				queries: [],
				rank: { audience: 1311327, similarweb_monthly_visits: 61423055 },
				social: {},
				source: { id: "1233730921", name: "fake source name", title: "http://www.terra.com.br", url: "http://www.terra.com.br" },
				tags: [],
				title: "Document title"
			}
		);

		expect(twitterDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 followers",
						value: "0",
					},
				},
				country: "ES",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-twitter",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Twitter",
				tags: undefined,
				title: "Document content"
			}
		);

		twitterDocument!.author!.followers_count = "20000";
		twitterDocument!.content = "";
		twitterDocument!.date = "";
		twitterDocument!.media.image = ["fake image"];
		twitterDocument!.image.thumb = null;
		expect(twitterDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 20K followers",
						value: "20K",
					},
				},
				country: "ES",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-twitter",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Twitter",
				tags: undefined,
				title: ""
			}
		);

		twitterDocument!.author = {};
		twitterDocument!.social = null;
		twitterDocument!.media = [{ photo_url: 'fake image' }];
		expect(twitterDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: undefined,
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 followers",
						value: "0",
					},
				},
				country: "ES",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-twitter",
				id: "document-id-1",
				image: "fake image",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Twitter",
				tags: undefined,
				title: ""
			}
		);
	});

	it('should create a new GalleryDocument', () => {

		const galleryDocumentSource = cloneDeep(document);
		galleryDocumentSource!.provider = 'Gallery';
		const galleryDocument: Document | null = factory(cloneDeep(galleryDocumentSource));
		expect(galleryDocument).toEqual(
			{
				_ranges: [{ decimal: 1, divider: 1000000, suffix: "M" }, { decimal: 0, divider: 1000, suffix: "K" }],
				author: { id: 1506856080, name: "Fake name" },
				brand_associated: "",
				company: "Document company",
				category: "category",
				category_id: "",
				content: "Document content",
				country: { iso: "es" },
				date: "2019-04-04T06:30:57Z",
				date_from_provider: "1992-03-05T06:30:57Z",
				id: "document-id-1",
				image: { thumb: "fake" },
				image_url: "",
				cover: { thumb: "fake", url: "fake" },
				issue_number: "",
				language: { code: "pt", id: "7", name: "Portuguese" },
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				line: "Document line",
				location: {
					continent: { id: "02", name: "South America" },
					country: { id: "0208", iso: "BR", name: "Brazil" }
				},
				media: { thumb: "fake" },
				page_number: "",
				page_occupation: 0,
				place: null,
				provider: "Gallery",
				queries: [],
				rank: { audience: 1311327, similarweb_monthly_visits: 61423055 },
				social: {},
				source: { id: "1233730921", name: "fake source name", title: "http://www.terra.com.br", url: "http://www.terra.com.br" },
				tags: [],
				title: "Document title"
			}
		);

		expect(galleryDocument!.prepare()).toEqual(
			{
				author_icon: "https://faviewhaiy.s3.amazonaws.com/1/1233730921.ico",
				author_link: "http://www.terra.com.br",
				author_name: "http://www.terra.com.br",
				categories_id: "category",
				content: "Document content",
				counters: {
					echo: {
						title: "",
						value: "",
					},
					engagement: {
						title: "Engagement/Views: 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 61.4M visitors",
						value: "61.4M",
					},
				},
				country: "BR",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-gallery",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: "Image #",
				provider: "Gallery",
				tags: undefined,
				title: "Document title"
			}
		);

		galleryDocument!.social.shares = null;
		galleryDocument!.rank!.audience = 0;
		galleryDocument!.rank!.similarweb_monthly_visits = 0;
		galleryDocument!.date_from_provider = "";
		expect(galleryDocument!.prepare()).toEqual(
			{
				author_icon: "https://faviewhaiy.s3.amazonaws.com/1/1233730921.ico",
				author_link: "http://www.terra.com.br",
				author_name: "http://www.terra.com.br",
				categories_id: "category",
				content: "Document content",
				counters: {
					echo: {
						title: "",
						value: "",
					},
					engagement: {
						title: "Engagement/Views: 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 visitors",
						value: "0",
					},
				},
				country: "BR",
				date: "Apr 04",
				dateTitle: "Thursday, April 4, 2019 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-gallery",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: "Image #",
				provider: "Gallery",
				tags: undefined,
				title: "Document title"
			}
		);

		galleryDocument!.social = null;
		galleryDocument!.rank = {};
		expect(galleryDocument!.prepare()).toEqual(
			{
				author_icon: "https://faviewhaiy.s3.amazonaws.com/1/1233730921.ico",
				author_link: "http://www.terra.com.br",
				author_name: "http://www.terra.com.br",
				categories_id: "category",
				content: "Document content",
				counters: {
					echo: {
						title: "",
						value: "",
					},
					engagement: {
						title: "Engagement/Views: 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 visitors",
						value: "0",
					},
				},
				country: "BR",
				date: "Apr 04",
				dateTitle: "Thursday, April 4, 2019 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-gallery",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: "Image #",
				provider: "Gallery",
				tags: undefined,
				title: "Document title",

			}
		);
	});

	it('should create a new YoutubeDocument', () => {

		const youtubeDocumentSource = cloneDeep(document);

		youtubeDocumentSource.provider = "YouTube";
		youtubeDocumentSource.place = {};
		youtubeDocumentSource.place.country_code = "ES";

		const youtubeDocument: Document | null = factory(youtubeDocumentSource);
		expect(youtubeDocument).toEqual(
			{
				_ranges: [{ decimal: 1, divider: 1000000, suffix: "M" }, { decimal: 0, divider: 1000, suffix: "K" }],
				author: { id: 1506856080, name: "Fake name" },
				brand_associated: "",
				company: "Document company",
				category: "category",
				category_id: "",
				content: "Document content",
				country: { iso: "es" },
				date: "2019-04-04T06:30:57Z",
				date_from_provider: "1992-03-05T06:30:57Z",
				id: "document-id-1",
				image: { thumb: "fake" },
				image_url: "",
				cover: { thumb: "fake", url: "fake" },
				issue_number: "",
				language: { code: "pt", id: "7", name: "Portuguese" },
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				line: "Document line",
				location: {
					continent: { id: "02", name: "South America" },
					country: { id: "0208", iso: "BR", name: "Brazil" }
				},
				media: { thumb: "fake" },
				page_number: "",
				page_occupation: 0,
				place: {
					country_code: "ES"
				},
				provider: "YouTube",
				queries: [],
				rank: { audience: 1311327, similarweb_monthly_visits: 61423055 },
				social: {},
				source: { id: "1233730921", name: "fake source name", title: "http://www.terra.com.br", url: "http://www.terra.com.br" },
				tags: [],
				title: "Document title"
			}
		);

		expect(youtubeDocument!.prepare()).toEqual(
			{
				author_icon: "",
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "Document content",
				counters: {
					engagement: {
						title: "results.counters.likes",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 Subscribers",
						value: "0",
					},
					replies: {
						title: "results.counters.replies",
						value: "0",
					},
					views: {
						title: "results.counters.views",
						value: "0",
					},
				},
				country: "",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-youtube",
				id: "document-id-1",
				image: {
					thumb: "fake",
				},
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "YouTube",
				tags: undefined,
				title: "Document title"
			}
		);

		youtubeDocument!.social = null;
		youtubeDocument!.author = {};
		expect(youtubeDocument!.prepare()).toEqual(
			{
				author_icon: "",
				author_link: undefined,
				author_name: undefined,
				categories_id: "category",
				content: "Document content",
				counters: {
					engagement: {
						title: "results.counters.likes",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 Subscribers",
						value: "0",
					},
					replies: {
						title: "results.counters.replies",
						value: "0",
					},
					views: {
						title: "results.counters.views",
						value: "0",
					},
				},
				country: "",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-youtube",
				id: "document-id-1",
				image: {
					thumb: "fake",
				},
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "YouTube",
				tags: undefined,
				title: "Document title",
			}
		);
	});

	it('should create a new InstagramDocument', () => {

		const instagramDocumentSource = cloneDeep(document);

		instagramDocumentSource.provider = "Instagram";
		instagramDocumentSource.place = {};
		instagramDocumentSource.place.country_code = "ES";

		const instagramDocument: Document | null = factory(instagramDocumentSource);
		expect(instagramDocument).toEqual(
			{
				_ranges: [{ decimal: 1, divider: 1000000, suffix: "M" }, { decimal: 0, divider: 1000, suffix: "K" }],
				author: { id: 1506856080, name: "Fake name" },
				brand_associated: "",
				company: "Document company",
				category: "category",
				category_id: "",
				content: "Document content",
				country: { iso: "es" },
				date: "2019-04-04T06:30:57Z",
				date_from_provider: "1992-03-05T06:30:57Z",
				id: "document-id-1",
				image: { thumb: "fake" },
				image_url: "",
				cover: { thumb: "fake", url: "fake" },
				issue_number: "",
				language: { code: "pt", id: "7", name: "Portuguese" },
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				line: "Document line",
				location: {
					continent: { id: "02", name: "South America" },
					country: { id: "0208", iso: "BR", name: "Brazil" }
				},
				media: { thumb: "fake" },
				page_number: "",
				page_occupation: 0,
				place: {
					country_code: "ES"
				},
				provider: "Instagram",
				queries: [],
				rank: { audience: 1311327, similarweb_monthly_visits: 61423055 },
				social: {},
				source: { id: "1233730921", name: "fake source name", title: "http://www.terra.com.br", url: "http://www.terra.com.br" },
				tags: [],
				title: "Document title"
			}
		);

		expect(instagramDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 replies",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 followers",
						value: "0",
					},
				},
				country: undefined,
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-instagram",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Instagram",
				tags: undefined,
				title: "Document content",

			}
		);

		instagramDocument!.social = { likes: 50000 };
		instagramDocument!.author = { followers: 50000, name: "pepito" };
		instagramDocument!.content = "";
		instagramDocument!.image_url = "image url";
		expect(instagramDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "pepito",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 50K likes + 0 replies",
						value: "50K",
					},
					reach: {
						title: "Reach/Subscribers: 50K followers",
						value: "50K",
					},
				},
				country: undefined,
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-instagram",
				id: "document-id-1",
				image: "image url",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Instagram",
				tags: undefined,
				title: "pepito",

			}
		);
	});

	it('should create a new FacebookDocument', () => {

		const facebookDocumentSource = cloneDeep(document);

		facebookDocumentSource.provider = "Facebook";
		facebookDocumentSource.place = {};
		facebookDocumentSource.place.country_code = "ES";

		const facebookDocument: Document | null = factory(facebookDocumentSource);
		expect(facebookDocument).toEqual(
			{
				_ranges: [{ decimal: 1, divider: 1000000, suffix: "M" }, { decimal: 0, divider: 1000, suffix: "K" }],
				author: { id: 1506856080, name: "Fake name" },
				brand_associated: "",
				company: "Document company",
				category: "category",
				category_id: "",
				content: "Document content",
				country: { iso: "es" },
				date: "2019-04-04T06:30:57Z",
				date_from_provider: "1992-03-05T06:30:57Z",
				id: "document-id-1",
				image: { thumb: "fake" },
				image_url: "",
				cover: { thumb: "fake", url: "fake" },
				issue_number: "",
				language: { code: "pt", id: "7", name: "Portuguese" },
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				line: "Document line",
				location: {
					continent: { id: "02", name: "South America" },
					country: { id: "0208", iso: "BR", name: "Brazil" }
				},
				media: { thumb: "fake" },
				page_number: "",
				page_occupation: 0,
				place: {
					country_code: "ES"
				},
				provider: "Facebook",
				queries: [],
				rank: { audience: 1311327, similarweb_monthly_visits: 61423055 },
				social: {},
				source: { id: "1233730921", name: "fake source name", title: "http://www.terra.com.br", url: "http://www.terra.com.br" },
				tags: [],
				title: "Document title"
			}
		);

		expect(facebookDocument!.prepare()).toEqual(
			{
				author_icon: "http://graph.facebook.com/1506856080/picture?type=square",
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 shares + 0 replies",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 followers",
						value: "0",
					},
				},
				country: undefined,
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-facebook",
				id: "document-id-1",
				image: {
					thumb: "fake",
				},
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Facebook",
				tags: undefined,
				title: "Document content"
			}
		);

		facebookDocument!.social = { likes: 50000 };
		facebookDocument!.author = { followers: 50000, name: "pepito" };
		expect(facebookDocument!.prepare()).toEqual(
			{
				author_icon: "http://graph.facebook.com/undefined/picture?type=square",
				author_link: undefined,
				author_name: "pepito",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 50K likes + 0 shares + 0 replies",
						value: "50K",
					},
					reach: {
						title: "Reach/Subscribers: 50K followers",
						value: "50K",
					},
				},
				country: undefined,
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-facebook",
				id: "document-id-1",
				image: {
					thumb: "fake",
				},
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Facebook",
				tags: undefined,
				title: "Document content"
			}
		);
	});

	it('should split tags correctly', () => {

		const twitterDocumentSource = cloneDeep(document);

		twitterDocumentSource.provider = "Twitter";
		twitterDocumentSource.content = "Blabla #LM @LM blabla";
		twitterDocumentSource.place = {};
		twitterDocumentSource.place.country_code = "ES";

		const twitterDocument: Document | null = factory(twitterDocumentSource);

		expect(twitterDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 followers",
						value: "0",
					},
				},
				country: "ES",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-twitter",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Twitter",
				tags: undefined,
				title: "Blabla #LM @LM blabla",

			}
		);

		twitterDocument!.content = "#LM #ML";
		expect(twitterDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 followers",
						value: "0",
					},
				},
				country: "ES",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-twitter",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Twitter",
				tags: undefined,
				title: "#LM #ML",
			}
		);

		twitterDocument!.content = "#LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML#LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM ";
		twitterDocument!.content += "#ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML";
		expect(twitterDocument!.prepare()).toEqual(
			{
				author_icon: undefined,
				author_link: undefined,
				author_name: "Fake name",
				categories_id: "category",
				content: "#ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML",
				counters: {
					engagement: {
						title: "Engagement/Views: 0 likes + 0 shares",
						value: "0",
					},
					reach: {
						title: "Reach/Subscribers: 0 followers",
						value: "0",
					},
				},
				country: "ES",
				date: "Mar 05",
				dateTitle: "Thursday, March 5, 1992 6:30 AM",
				date_from_provider: undefined,
				icon: "icon-twitter",
				id: "document-id-1",
				image: "",
				cover: undefined,
				cover_link: undefined,
				link: "http://discover.staging.launchmetrics.com/r/d/17Xw6MAhy0c=_ckkDAAAAAAAAAAAAAAAAAA==",
				page: undefined,
				provider: "Twitter",
				tags: undefined,
				title: "#LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM #ML #LM",
			}
		);
	});
});
