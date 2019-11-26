import { mount } from "enzyme";
import React from "react";
import Categorization from "@src/components/common/Categorization/Categorization";
import { TenantObject } from "@src/class/Tenant";

describe("Categorization", () => {
	let wrapper: any;
	let fetchTenantTagsMock: any;
	let onSetCategoryMock: any;
	let onRemoveTagMock: any;
	let onAddTagsMock: any;
	let onAddNotification: any;

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

	const availableTags = [
		{ tag: 'tag1', occurences: 2 },
		{ tag: 'tag2', occurences: 1 },
		{ tag: 'tag3', occurences: 8 }
	];

	beforeEach(() => {
		fetchTenantTagsMock = jest.fn();
		onSetCategoryMock = jest.fn();
		onRemoveTagMock = jest.fn();
		onAddTagsMock = jest.fn();
		onAddNotification = jest.fn();
		wrapper = mount(
			<Categorization
				tenant={tenant}
				tags={new Set('tag')}
				onAddTags={onAddTagsMock}
				onRemoveTag={onRemoveTagMock}
				onSetCategory={onSetCategoryMock}
				availableTags={availableTags}
				fetchTenantTags={fetchTenantTagsMock}
				onAddNotification={onAddNotification}
			/>
		);
	});

	it("Test component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot without tenant", () => {
		wrapper = mount(
			<Categorization
				tenant={null}
				tags={new Set('tag')}
				onAddTags={onAddTagsMock}
				onRemoveTag={onRemoveTagMock}
				onSetCategory={onSetCategoryMock}
				availableTags={availableTags}
				fetchTenantTags={fetchTenantTagsMock}
				onAddNotification={onAddNotification}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test select category", () => {
		expect(onSetCategoryMock).toHaveBeenCalledTimes(0);
		wrapper.find(".categorization-category-input").at(0).props().onAutocomplete(null, 0, [{ id: "010102" }]);
		expect(onSetCategoryMock).toHaveBeenCalledTimes(1);
	});

	it("Test select category input change", () => {
		expect(wrapper.state('categoryInput')).toBe('');
		wrapper.find(".categorization-category-input").at(0).props().onChange('test');
		wrapper.update();
		expect(wrapper.state('categoryInput')).toBe('test');
	});

	it("Test select category remove button", () => {
		wrapper.setState({ categoryInput: 'test' });
		wrapper.find("#categorizationCategoryRemoveButton").at(0).simulate('click');
		expect(wrapper.state('categoryInput')).toBe('');
	});

	it("Test set tag", () => {
		expect(onAddTagsMock).toHaveBeenCalledTimes(0);
		wrapper.find(".categorization-tags-input").at(0).props().onAutocomplete(null, 0, [{ value: "tag1" }]);
		expect(onAddTagsMock).toHaveBeenCalledTimes(1);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test remove tag", () => {
		wrapper.find(".categorization-tags-input").at(0).props().onAutocomplete(null, 0, [{ value: "tag2" }]);
		wrapper.update();
		expect(onRemoveTagMock).toHaveBeenCalledTimes(0);
		wrapper.find(".categorization-tags-selected .categorization-tags-selected-item-remove").at(0).simulate('click');
		expect(onRemoveTagMock).toHaveBeenCalledTimes(1);
	});

	it("Test on change tag input", () => {
		wrapper.find(".categorization-tags-input").at(0).props().onChange("test155");
		expect(wrapper.state().tagSuggested).toBe("test155");
	});

	it("Test tag too short notification", () => {
		wrapper.find(".categorization-tags-input").at(0).props().onAutocomplete(null, 0, [{ value: "aa" }]);
		expect(onAddNotification).toHaveBeenCalledTimes(1);
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'results.categorize.error.minTagLength', level: 'warning' });
	});

	it("Test tag too large notification", () => {
		// eslint-disable-next-line max-len
		wrapper.find(".categorization-tags-input").at(0).props().onAutocomplete(null, 0, [{ value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }]);
		expect(onAddNotification).toHaveBeenCalledTimes(1);
		expect(onAddNotification).toHaveBeenCalledWith({ t: 'results.categorize.error.maxTagLength', level: 'warning' });
	});
});
