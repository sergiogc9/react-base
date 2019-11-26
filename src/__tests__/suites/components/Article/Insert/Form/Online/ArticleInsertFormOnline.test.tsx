import React from "react";
import { shallow } from "enzyme";
import moment from 'moment';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import { TenantObject } from "@src/class/Tenant";
import { ApiMediaObj } from '@src/types/medias/medias';
import { convert, convertReverse } from '@src/lib/currency';
import ArticleInsertFormOnline from '@src/components/Article/Insert/Form/Online/ArticleInsertFormOnline';
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const url = "fake url";

const user = TestHelper.getUser();

const tenant: TenantObject = {
	id: 'rd-girona-test',
	guid: '00034972-0000-0000-0000-000000000000',
	name: 'rd.girona.test',
	tier_properties: {
		name: 'custom',
		results: {
			online: true,
			social: true
		}
	},
	print_only: false,
	facebook_linked_ids: [
		'157193954975917'
	],
	settings: {
		categorization_mode: 'no_flc',
		currency: 'USD',
		display_influencers: true,
		facebook_url: 'https://www.facebook.com/conjunt.chapo',
		valuation_metric: 'miv'
	}
};

const fetchedMedia: ApiMediaObj = {
	agency_id: null,
	average_daily_saved_articles: 66.8667,
	description: "",
	generic_email: "redaccion@3djuegos.com",
	id: 1133177530,
	inserted_at: "2005-11-28T11:32:10Z",
	is_in_google_news: "YES",
	language: {
		code: "es",
		id: 0,
		name: "spanish"
	},
	location: {
		continent: {
			id: "01",
			name: "Europe"
		},
		country: {
			code: "ES",
			id: "0100",
			name: "Spain"
		},
		region: {
			id: "010011",
			name: "Aragon"
		},
		subregion: {
			id: "01001103",
			name: "Zaragoza"
		}
	},
	modified_at: "2019-07-12T12:44:48Z",
	origin: "imente",
	rank: {
		advertising_value: "11485",
		alexa_inlinks: 1283,
		alexa_inlinks_host_match: 1,
		alexa_page_views: 2.39,
		alexa_rank: 3441,
		alexa_reach: 243,
		audience: "961081",
		audience_mode: "ALEXA_REACH",
		google_inlinks: 28,
		google_pagerank: 5,
		miv: {
			DISCOVER_VALUE: 5116.35805374881,
			VALUE: 5116.35805374881
		},
		similarweb_applied_correcion: "none",
		similarweb_monthly_visits: "22543190",
		similarweb_updated_at: "2019-07-11 01:32:51",
		source_rank: 66882
	},
	searchers: [
		"https://www.3djuegos.com/",
		"http://www.3djuegos.com?par1=0"
	],
	status: 1,
	title: "3D Juegos",
	typology: {
		id: 0,
		name: "Online Media"
	},
	url: "https://www.3djuegos.com"
};

jest.useFakeTimers();

describe("<ArticleInsertFormOnline>", () => {

	let wrapper: any;
	let onFetchMedias: any;
	let onFetchMediaInfo: any;
	let onValidationSuccess: any;
	let onValidationError: any;
	let onAddNotification: any;

	beforeEach(() => {
		onFetchMedias = jest.fn();
		onFetchMediaInfo = jest.fn();
		onValidationSuccess = jest.fn();
		onValidationError = jest.fn();
		onAddNotification = jest.fn();

		wrapper = shallow(
			<ArticleInsertFormOnline
				user={user}
				tenant={tenant}
				url={url}
				availableMedias={[]}
				fetchedMedia={null}
				onFetchMedias={onFetchMedias}
				onFetchMediaInfo={onFetchMediaInfo}
				submit={false}
				onValidationSuccess={onValidationSuccess}
				onValidationError={onValidationError}
				loading={false}
				onAddNotification={onAddNotification}
			/>
		);
	});

	it("Test headline input", () => {
		wrapper.find("#insertMentionOnlineFormHeadline").at(0).props().onChange('test');
		expect(wrapper.state('headline')).toBe('test');
	});

	it("Test content input", () => {
		wrapper.find("#insertMentionOnlineFormContent").at(0).props().onChange('test content');
		expect(wrapper.state('content')).toBe('test content');
	});

	it("Test media name input", () => {
		wrapper.setState({ mediaId: '1234' });
		wrapper.find("#insertMentionOnlineFormMediaName").at(0).props().onChange('test media name');
		expect(wrapper.state('mediaName')).toBe('test media name');
		expect(wrapper.state('mediaId')).toBe('');
	});

	it("Test language input", () => {
		wrapper.setState({ languageCode: '1234' });
		wrapper.find("#insertMentionOnlineFormLanguage").at(0).props().onChange('test language');
		expect(wrapper.state('languageCode')).toBe('');
		expect(wrapper.state('languageName')).toBe('test language');
		wrapper.find("#insertMentionOnlineFormLanguageRemoveButton").at(0).simulate('click');
		expect(wrapper.state('languageCode')).toBe('');
		expect(wrapper.state('languageName')).toBe('');
	});

	it("Test language autocompleter", () => {
		const languageOption = { id: "1234", name: "Test language" };
		wrapper.find("#insertMentionOnlineFormLanguage").at(0).props().onAutocomplete(null, 0, [languageOption]);
		expect(wrapper.state('languageCode')).toBe(languageOption.id);
		expect(wrapper.state('languageName')).toBe(languageOption.name);
	});

	it("Test country input", () => {
		wrapper.setState({ countryCode: '1234' });
		wrapper.find("#insertMentionOnlineFormCountry").at(0).props().onChange('test country');
		expect(wrapper.state('countryCode')).toBe('');
		expect(wrapper.state('countryName')).toBe('test country');
		wrapper.find("#insertMentionOnlineFormCountryRemoveButton").at(0).simulate('click');
		expect(wrapper.state('countryCode')).toBe('');
		expect(wrapper.state('countryName')).toBe('');
	});

	it("Test country autocompleter", () => {
		const countryOption = { id: "1234", name: "Test country" };
		wrapper.find("#insertMentionOnlineFormCountry").at(0).props().onAutocomplete(null, 0, [countryOption]);
		expect(wrapper.state('countryCode')).toBe(countryOption.id);
		expect(wrapper.state('countryName')).toBe(countryOption.name);
	});

	it("Test valuation input", () => {
		expect(wrapper.state('valuation')).toBe(0);
		wrapper.find("#insertMentionOnlineFormValuation").at(0).props().onChange(100);
		expect(wrapper.state('valuation')).toBe(100);
		wrapper.find("#insertMentionOnlineFormValuation").at(0).props().onChange(-4);
		expect(wrapper.state('valuation')).toBe(0);
		wrapper.find("#insertMentionOnlineFormValuation").at(0).props().onChange('');
		expect(wrapper.state('valuation')).toBe('');
	});

	it("Test date input same day", () => {
		const date = moment().set({ hour: 0 });
		const today = moment().tz('utc');
		const expectedDate = moment.tz(date.format('YYYY-MM-DD'), 'utc').add(today.hours(), 'h').add(today.minutes(), 'm').add(today.seconds(), 's').add(today.milliseconds(), 'ms');
		wrapper.find("#insertMentionOnlineFormDate").at(0).props().onChange('', date.toDate(), null);
		expect(moment.tz(wrapper.state('date'), 'utc').format('YYYY-MM-DD H:mm:s')).toEqual(expectedDate.format('YYYY-MM-DD H:mm:s'));
	});

	it("Test date input different day", () => {
		const date = moment().subtract(1, 'day');
		const today = moment();
		const expectedDate = moment.tz(date.format('YYYY-MM-DD'), 'utc').add(12, 'h').add(today.minutes(), 'm').add(today.seconds(), 's').add(today.milliseconds(), 'ms');
		wrapper.find("#insertMentionOnlineFormDate").at(0).props().onChange('', date.toDate(), null);
		expect(moment.tz(wrapper.state('date'), 'utc').format('YYYY-MM-DD H:mm:s')).toEqual(expectedDate.format('YYYY-MM-DD H:mm:s'));
	});

	it("Test media url input", () => {
		wrapper.find("#insertMentionOnlineFormMediaUrl").at(0).props().onChange('a');
		expect(wrapper.state('mediaUrl')).toBe('a');
		jest.runAllTimers();
		expect(onFetchMedias).toHaveBeenCalledTimes(1);
		wrapper.find("#insertMentionOnlineFormMediaUrl").at(0).props().onChange('trigger search');
		jest.runAllTimers();
		expect(onFetchMedias).toHaveBeenCalledTimes(2);
		wrapper.find("#insertMentionOnlineFormMediaUrlRemoveButton").at(0).simulate('click');
		expect(wrapper.state('mediaId')).toBe('');
		expect(wrapper.state('mediaUrl')).toBe('');
	});

	it("Test media url autocompleter", () => {
		const mediaOption = { id: '1234', name: 'media test', label: 'media test', url: 'media url test' };
		expect(onFetchMediaInfo).toHaveBeenCalledTimes(0);
		wrapper.find("#insertMentionOnlineFormMediaUrl").at(0).props().onAutocomplete(null, 0, [mediaOption]);
		expect(wrapper.state('mediaId')).toBe(mediaOption.id);
		expect(wrapper.state('mediaName')).toBe(mediaOption.name);
		expect(wrapper.state('mediaUrl')).toBe(mediaOption.url);
		expect(onFetchMediaInfo).toHaveBeenCalledTimes(1);
	});

	it("Test media url autocompleter with custom suggestion", () => {
		const mediaOption = { id: '-1', name: 'custom', label: 'custom', url: 'url' };
		wrapper.find("#insertMentionOnlineFormMediaUrl").at(0).props().onAutocomplete(null, 0, [mediaOption]);
		expect(wrapper.state('mediaId')).toBe('');
		expect(onFetchMediaInfo).toHaveBeenCalledTimes(0);
	});

	it("Test should not fetch media", () => {
		const mediaOption = { id: '1133177530', name: 'media test', url: 'media url test' };
		wrapper.setProps({ fetchedMedia });
		wrapper.setState({ languageCode: '' });
		wrapper.find("#insertMentionOnlineFormMediaUrl").at(0).props().onAutocomplete(null, 0, [mediaOption]);
		expect(onFetchMediaInfo).toHaveBeenCalledTimes(0);
		expect(wrapper.state('languageCode')).toBe(fetchedMedia.language.code);
	});

	it("Test available medias", () => {
		const media = { id: '1234', name: 'media test', url: 'media url test' };
		wrapper.setProps({ availableMedias: [media] });
		expect(wrapper.find("#insertMentionOnlineFormMediaUrl").at(0).props().data).toEqual([
			{
				...media,
				label: <React.Fragment><span className="media-option-name">{media.name}</span> {media.url}</React.Fragment>
			}
		]);
	});

	it("Test fetched media language/country inputs completation", () => {
		wrapper.setProps({ fetchedMedia });
		expect(wrapper.state('mediaId')).toBe(String(fetchedMedia.id));
		expect(wrapper.state('languageCode')).toBe(fetchedMedia.language.code);
		expect(wrapper.state('languageName')).toBe("filters.language." + fetchedMedia.language.code);
		expect(wrapper.state('countryCode')).toBe(fetchedMedia.location.country.code);
		expect(wrapper.state('countryName')).toBe("filters.country." + fetchedMedia.location.country.code);
		wrapper.setProps({ fetchedMedia: { ...fetchedMedia, id: 1, location: {} } });
		expect(wrapper.state('countryCode')).toBe('');
		expect(wrapper.state('countryName')).toBe('');
	});

	it("Test fetched media valuation completation", () => {
		const date = new Date();
		const tenantMiv = {
			...tenant,
			settings: {
				...tenant.settings,
				valuation_metric: 'miv'
			}
		};
		const rawValuation = convert(+fetchedMedia.rank.miv.DISCOVER_VALUE, date.toISOString());
		const valuation = +rawValuation.toFixed(2);
		wrapper.setProps({ tenant: tenantMiv, fetchedMedia });
		expect(wrapper.state('rawValuation')).toBe(rawValuation);
		expect(wrapper.state('valuation')).toBe(valuation);
	});

	it("Test onAddTagsCalled and onRemoveTag and setCategory", () => {
		const set = new Set();
		wrapper.find("#insertMentionOnlineFormCategorizationContainer").children().at(0).props().onAddTags(['tagTest']);
		set.add('tagTest');
		expect(wrapper.state().tags).toEqual(set);
		wrapper.find("#insertMentionOnlineFormCategorizationContainer").children().at(0).props().onRemoveTag('tagTest');
		set.delete('tagTest');
		expect(wrapper.state().tags).toEqual(set);
		wrapper.find("#insertMentionOnlineFormCategorizationContainer").children().at(0).props().onSetCategory('00110011');
		expect(wrapper.state().category).toEqual("00110011");
	});

	it("Test validation process - All inputs empty except date", () => {
		wrapper.setProps({ submit: true });
		expect(onValidationError).toBeCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: true,
			mediaUrl: true,
			mediaName: true,
			languageName: true,
			date: false
		});
	});

	it("Test validation process - Media url empty", () => {
		wrapper.setState({ headline: 'test', mediaName: 'test', languageCode: '1' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toBeCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: false,
			mediaUrl: true,
			mediaName: false,
			languageName: false,
			date: false
		});
	});

	it("Test validation process - Wrong url format", () => {
		wrapper.setState({ headline: 'test', mediaName: 'test', languageCode: '1', mediaUrl: 'bad url' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toBeCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: false,
			mediaUrl: true,
			mediaName: false,
			languageName: false,
			date: false
		});
	});

	it("Test validation process - Url without protocol", () => {
		wrapper.setState({ headline: 'test', mediaName: 'test', languageCode: '1', mediaUrl: 'urlwithoutprotocol.com' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toBeCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: false,
			mediaUrl: true,
			mediaName: false,
			languageName: false,
			date: false
		});
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'error.url_not_valid', level: 'warning' });
	});

	it("Test validation process - Language not seleted from autocompleter", () => {
		wrapper.setState({ headline: 'test', mediaName: 'test', languageCode: '', mediaUrl: 'http://goodurl.com' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toBeCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: false,
			mediaUrl: false,
			mediaName: false,
			languageName: true,
			date: false
		});
	});

	it("Test validation process - Content too large", () => {
		const content = "a".repeat(20000);
		wrapper.setState({ headline: 'test', mediaName: 'test', languageCode: '1', mediaUrl: 'http://goodurl.com', content });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toBeCalledTimes(1);
	});

	it("Test validation process - All fields valid", () => {
		wrapper.setState({ headline: 'test', mediaName: 'test', languageCode: '1', mediaUrl: 'http://goodurl.com', content: 'right content' });
		wrapper.setProps({ submit: true });
		expect(onValidationSuccess).toBeCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: false,
			mediaUrl: false,
			mediaName: false,
			languageName: false,
			date: false
		});
	});

	it("Test prepare form", () => {
		const date = new Date();
		const parsedDate = moment(date).tz('utc').format();
		const rawValuation = convert(+fetchedMedia.rank.advertising_value, date.toISOString());
		const valuation = +rawValuation.toFixed(2);
		const parsedValuation = convertReverse(+rawValuation, parsedDate);
		const tags = new Set('tagTest');

		wrapper.setState({
			headline: 'test',
			content: 'test',
			mediaUrl: fetchedMedia.url,
			mediaId: fetchedMedia.id,
			mediaName: fetchedMedia.typology.name,
			languageCode: fetchedMedia.language.code,
			languageName: 'language name',
			countryCode: fetchedMedia.location.country.code,
			countryName: 'country name',
			rawValuation,
			valuation,
			similarWebMonthlyVisits: fetchedMedia.rank.similarweb_monthly_visits,
			date,
			tags,
			category: '00110011'
		});

		wrapper.setProps({ submit: true });
		expect(onValidationSuccess).toBeCalledTimes(1);
		expect(onValidationSuccess).toHaveBeenCalledWith({
			title: 'test',
			content: 'test',
			country: fetchedMedia.location.country.code,
			date: parsedDate,
			language: fetchedMedia.language.code,
			media_id: fetchedMedia.id,
			media_url: fetchedMedia.url,
			media_name: fetchedMedia.typology.name,
			miv: parsedValuation,
			similarweb_monthly_visits: fetchedMedia.rank.similarweb_monthly_visits,
			tags,
			category: '00110011'
		});
	});

	it("Test loading", () => {
		expect(wrapper.find(CircularProgress).exists()).toEqual(false);
		wrapper.setProps({ loading: true });
		expect(wrapper.find(CircularProgress).exists()).toEqual(true);
	});
});
