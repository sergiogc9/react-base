import React from "react";
import { shallow } from "enzyme";
import moment from 'moment';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import { TenantObject } from "@src/class/Tenant";
import ArticleInsertFormPrint from "@src/components/Article/Insert/Form/Print/ArticleInsertFormPrint";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const user=TestHelper.getUser();

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

const date = new Date();

const image = {
	lastModified: date.getTime(),
	name: 'test_file.png',
	size: 30000,
	type: 'image/png'
};

describe("<ArticleInsertFormPrint>", () => {

	let wrapper: any;
	let onAddNotification: any;
	let onValidationSuccess: any;
	let onValidationError: any;

	beforeEach(() => {
		onAddNotification = jest.fn();
		onValidationSuccess = jest.fn();
		onValidationError = jest.fn();

		wrapper = shallow(
			<ArticleInsertFormPrint
				user={user}
				tenant={tenant}
				onAddNotification={onAddNotification}
				submit={false}
				onValidationSuccess={onValidationSuccess}
				onValidationError={onValidationError}
				loading={false}
			/>
		);
	});

	it("Test headline input", () => {
		wrapper.find("#insertMentionPrintFormHeadline").at(0).props().onChange('test');
		expect(wrapper.state('headline')).toBe('test');
	});

	it("Test image input", () => {
		const dropzone = wrapper.find("Dropzone").at(0);

		dropzone.props().onFilesAdded([image]);
		expect(wrapper.state('image')).toEqual(image);

		dropzone.props().onRemoveFile(image);
		expect(wrapper.state('image')).toEqual(null);

		dropzone.props().onFilesAdded([]);
		expect(wrapper.state('image')).toEqual(null);

		dropzone.props().onAddFilesError([{ error: 'file_too_large', file: image }]);
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'newsletter.digest.edit.custom_image.rejected_size', level: 'warning' });

		dropzone.props().onAddFilesError([{ error: 'incorrect_file_type', file: image }]);
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'newsletter.digest.edit.custom_image.rejected_type', level: 'warning' });

		dropzone.props().onAddFilesError([{ error: 'unexpected_error_type', file: image }]);
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'newsletter.digest.edit.custom_image.upload_error', level: 'warning' });
	});

	it("Test media name input", () => {
		wrapper.find("#insertMentionPrintFormMediaName").at(0).props().onChange('test media name');
		expect(wrapper.state('mediaName')).toBe('test media name');
	});

	it("Test page number input", () => {
		wrapper.find("#insertMentionPrintFormPageNumber").at(0).props().onChange(20);
		expect(wrapper.state('pageNumber')).toBe(20);

		wrapper.find("#insertMentionPrintFormPageNumber").at(0).props().onChange(-1);
		expect(wrapper.state('pageNumber')).toBe(0);

		wrapper.find("#insertMentionPrintFormPageNumber").at(0).props().onChange('');
		expect(wrapper.state('pageNumber')).toBe('');
	});

	it("Test edition number input", () => {
		wrapper.find("#insertMentionPrintFormEditionNumber").at(0).props().onChange(20);
		expect(wrapper.state('editionNumber')).toBe(20);

		wrapper.find("#insertMentionPrintFormEditionNumber").at(0).props().onChange(-1);
		expect(wrapper.state('editionNumber')).toBe(0);

		wrapper.find("#insertMentionPrintFormEditionNumber").at(0).props().onChange('');
		expect(wrapper.state('editionNumber')).toBe('');
	});

	it("Test country input", () => {
		wrapper.setState({ countryCode: '1234' });
		wrapper.find("#insertMentionPrintFormCountry").at(0).props().onChange('test country');
		expect(wrapper.state('countryCode')).toBe('');
		expect(wrapper.state('countryName')).toBe('test country');

		wrapper.find("#insertMentionPrintFormCountryRemoveButton").at(0).simulate('click');
		expect(wrapper.state('countryCode')).toBe('');
		expect(wrapper.state('countryName')).toBe('');
	});

	it("Test country autocompleter", () => {
		const countryOption = { id: "1234", name: "Test country" };
		wrapper.find("#insertMentionPrintFormCountry").at(0).props().onAutocomplete(null, 0, [countryOption]);
		expect(wrapper.state('countryCode')).toBe(countryOption.id);
		expect(wrapper.state('countryName')).toBe(countryOption.name);
	});

	it("Test edition circulation input", () => {
		wrapper.find("#insertMentionPrintFormCirculation").at(0).props().onChange(20);
		expect(wrapper.state('circulation')).toBe(20);

		wrapper.find("#insertMentionPrintFormCirculation").at(0).props().onChange(-1);
		expect(wrapper.state('circulation')).toBe(0);

		wrapper.find("#insertMentionPrintFormCirculation").at(0).props().onChange('');
		expect(wrapper.state('circulation')).toBe('');
	});

	it("Test edition circulation input", () => {
		wrapper.find("#insertMentionPrintFormCirculation").at(0).props().onChange(20);
		expect(wrapper.state('circulation')).toBe(20);

		wrapper.find("#insertMentionPrintFormCirculation").at(0).props().onChange(-1);
		expect(wrapper.state('circulation')).toBe(0);

		wrapper.find("#insertMentionPrintFormCirculation").at(0).props().onChange('');
		expect(wrapper.state('circulation')).toBe('');
	});

	it("Test valuation input", () => {
		expect(wrapper.state('valuation')).toBe(0);
		wrapper.find("#insertMentionPrintFormValuation").at(0).props().onChange(100);
		expect(wrapper.state('valuation')).toBe(100);

		wrapper.find("#insertMentionPrintFormValuation").at(0).props().onChange(-4);
		expect(wrapper.state('valuation')).toBe(0);

		wrapper.find("#insertMentionPrintFormValuation").at(0).props().onChange('');
		expect(wrapper.state('valuation')).toBe('');
	});

	it("Test date input", () => {
		const today = moment.tz('utc').startOf('day');
		wrapper.find("#insertMentionPrintFormDate").at(0).props().onChange('', today.toDate(), null);
		expect(moment.tz(wrapper.state('date'), 'utc').format('YYYY-MM-DD H:mm:ss')).toEqual(today.add(12, 'h').format('YYYY-MM-DD H:mm:ss'));
	});

	it("Test onAddTagsCalled and onRemoveTag and setCategory", () => {
		const set = new Set();
		wrapper.find("#insertMentionPrintFormCategorizationContainer").children().at(0).props().onAddTags(['tagTest']);
		set.add('tagTest');
		expect(wrapper.state().tags).toEqual(set);
		wrapper.find("#insertMentionPrintFormCategorizationContainer").children().at(0).props().onRemoveTag('tagTest');
		set.delete('tagTest');
		expect(wrapper.state().tags).toEqual(set);
		wrapper.find("#insertMentionPrintFormCategorizationContainer").children().at(0).props().onSetCategory('00110011');
		expect(wrapper.state().category).toEqual("00110011");
	});

	it("Test validation category error", () => {
		wrapper.setState({ image, headline: 'test', mediaName: 'test' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toHaveBeenCalledTimes(1);
		expect(onAddNotification).toHaveBeenCalledTimes(1);
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'insert_article.modal.select_category', level: 'warning' });
	});

	it("Test validation image error", () => {
		wrapper.setState({ category: '1010100', headline: 'test', mediaName: 'test' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toHaveBeenCalledTimes(1);
		expect(onAddNotification).toHaveBeenCalledTimes(1);
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'document.insert.form.missingImage', level: 'warning' });
	});

	it("Test validation headline error", () => {
		wrapper.setState({ category: '1010100', image,  mediaName: 'test' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toHaveBeenCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: true,
			mediaName: false,
			date: false
		});
	});

	it("Test validation media name error", () => {
		// wrapper.setState({ category: '1010100', image, headline: 'test', mediaName: 'test' });
		wrapper.setState({ category: '1010100', image, headline: 'test' });
		wrapper.setProps({ submit: true });
		expect(onValidationError).toHaveBeenCalledTimes(1);
		expect(wrapper.state('inputErrors')).toMatchObject({
			headline: false,
			mediaName: true,
			date: false
		});
	});

	it("Test validation all fields are valid", () => {
		wrapper.setState({ category: '1010100', image, headline: 'test', mediaName: 'test' });
		wrapper.setProps({ submit: true });
		expect(onValidationSuccess).toHaveBeenCalledTimes(1);
	});

	it("Test prepare form", () => {
		const headline = 'test headline';
		const mediaName = 'test';
		const countryCode = 1;
		const today = moment.tz('utc').add(12, 'h').toDate();
		const parsedDate = moment(today).tz('utc').format();
		const tags = new Set('tagTest');
		const category = '00110011';

		wrapper.setState({
			headline,
			image,
			mediaName,
			countryCode,
			countryName: 'country name',
			valuation: 10,
			date: today,
			tags,
			category
		});

		wrapper.setProps({ submit: true });
		expect(onValidationSuccess).toBeCalledTimes(1);
		expect(onValidationSuccess).toHaveBeenCalledWith({
			title: headline,
			country: countryCode,
			date: parsedDate,
			miv: 10,
			media_name: mediaName,
			image,
			tags,
			category
		});
		wrapper.setProps({ submit: false });

		wrapper.setState({ pageNumber: 10, editionNumber: 5, circulation: 20 });
		wrapper.setProps({ submit: true });
		expect(onValidationSuccess).toBeCalledTimes(2);
		expect(onValidationSuccess).toHaveBeenCalledWith({
			title: headline,
			country: countryCode,
			date: parsedDate,
			page: 10,
			edition_number: 5,
			circulation: 20,
			miv: 10,
			media_name: mediaName,
			image,
			tags,
			category
		});
		wrapper.setProps({ submit: false });
	});

	it("Test loading", () => {
		expect(wrapper.find(CircularProgress).exists()).toEqual(false);
		wrapper.setProps({ loading: true });
		expect(wrapper.find(CircularProgress).exists()).toEqual(true);
	});
});
