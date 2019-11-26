import React from "react";
import { shallow } from "enzyme";

import { DefinitionSocial, SocialInstagramAccount } from "@src/class/Feed";
import FocusFeedDefinitionSocial from "@src/components/Focus/Feed/Definition/Social/FocusFeedDefinitionSocial";
import { ComponentProps } from '@src/components/Focus/Feed/Definition/Social/types';

// tslint:disable-next-line:no-var-requires
const lucene = require("lucene");

const definition: DefinitionSocial = {
	main: {
		q: "kketa",
		enabled: true,
		scope: ['tags']
	},
	include_expressions: [
		{
			q: "kketa",
			enabled: true,
			scope: ['tags']
		},
		{
			q: "#kketa",
			enabled: true,
			scope: ['mentions']
		}
	],
	exclude_expressions: [
		{
			q: "kketa",
			enabled: true,
			scope: ['tags']
		},
		{
			q: "#kketa",
			enabled: true,
			scope: ['mentions']
		},
		{
			q: "@kketa",
			enabled: true,
			scope: ['tags']
		}
	],
	include_profiles: [
		{
			enabled: true,
			url: 'kketa',
			api_version: 'v1',
			screen_name: "kketa",
			name: "kketa",
			id: "1",
			channel_type_id: 30,
			picture: "kketa"
		},
		{
			enabled: true,
			url: '',
			api_version: 'v1',
			screen_name: "kketa",
			name: "kketa",
			id: "1",
			channel_type_id: 30,
			picture: "kketa"
		}
	],
	exclude_profiles: [{
		enabled: true,
		url: 'kketa',
		api_version: 'v1',
		screen_name: "kketa",
		name: "kketa",
		id: "1",
		channel_type_id: 30,
		picture: "kketa"
	},
	{
		enabled: true,
		url: '',
		api_version: 'v1',
		screen_name: "kketa",
		name: "kketa",
		id: "1",
		channel_type_id: 30,
		picture: "kketa"
	}],
	instagram_accounts: [],
	threshold: []
};

const instagramAccount: SocialInstagramAccount = {
	id: "id1",
	name: "Girona FC",
	profile_picture_url: "fakeurl.com",
	screen_name: "gironafc",
	valid: true
};
const instagramAccounts: SocialInstagramAccount[] = [instagramAccount];
const loadingProfiles = {
	include_profiles: [],
	exclude_profiles: []
};

describe("Definition social", () => {
	let wrapper: any;
	let onChangeMainQueryMock = jest.fn();
	let onChangeMainScopeMock = jest.fn();
	let onToggleEnableMainQueryMock = jest.fn();
	let onSetMainExpressionError = jest.fn();
	let onFetchSearch = jest.fn();
	let onChangeQueryMock = jest.fn();
	let onChangeScopeMock = jest.fn();
	let onToggleEnableQueryMock = jest.fn();
	let onAddExpressionMock = jest.fn();
	let onAddProfileExpressionMock = jest.fn();
	let onSetExpressionErrorMock = jest.fn();
	let onRemoveExpressionMock = jest.fn();
	let onRemoveProfileExpressionMock = jest.fn();
	let onFetchInstagramAccounts = jest.fn();
	let onToggleInstagramAccount = jest.fn();
	let onSetThreshold = jest.fn();
	let onChangeQueryProfileMock = jest.fn();
	let onSearchProfileMock = jest.fn();

	const getComponent = (props: Partial<ComponentProps> = {}) => (
		shallow(<FocusFeedDefinitionSocial
			definition={definition}
			instagramAccounts={instagramAccounts}
			loadingProfiles={loadingProfiles}
			onChangeMainQuery={onChangeMainQueryMock}
			onChangeMainScope={onChangeMainScopeMock}
			onToggleEnableMainQuery={onToggleEnableMainQueryMock}
			onSetMainExpressionError={onSetMainExpressionError}
			onChangeQuery={onChangeQueryMock}
			onChangeScope={onChangeScopeMock}
			onToggleEnableQuery={onToggleEnableQueryMock}
			onSetExpressionError={onSetExpressionErrorMock}
			onAddExpression={onAddExpressionMock}
			onAddProfileExpression={onAddProfileExpressionMock}
			onFetchSearch={onFetchSearch}
			onRemoveExpression={onRemoveExpressionMock}
			onRemoveProfileExpression={onRemoveProfileExpressionMock}
			onFetchInstagramAccounts={onFetchInstagramAccounts}
			onToggleInstagramAccount={onToggleInstagramAccount}
			onSetThreshold={onSetThreshold}
			onChangeQueryProfile={onChangeQueryProfileMock}
			onSearchProfile={onSearchProfileMock}
			{...props}
		/>)
	);

	beforeEach(() => {
		onChangeMainQueryMock = jest.fn();
		onChangeMainScopeMock = jest.fn();
		onToggleEnableMainQueryMock = jest.fn();
		onFetchSearch = jest.fn();
		onSetMainExpressionError = jest.fn();
		onChangeQueryMock = jest.fn();
		onChangeScopeMock = jest.fn();
		onToggleEnableQueryMock = jest.fn();
		onAddExpressionMock = jest.fn();
		onAddProfileExpressionMock = jest.fn();
		onSetExpressionErrorMock = jest.fn();
		onRemoveExpressionMock = jest.fn();
		onRemoveProfileExpressionMock = jest.fn();
		onFetchInstagramAccounts = jest.fn();
		onToggleInstagramAccount = jest.fn();
		onSetThreshold = jest.fn();
		onChangeQueryProfileMock = jest.fn();
		onSearchProfileMock = jest.fn();

		wrapper = getComponent();
	});

	it("Social definition ready", () => {
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Collapse expressions", () => {
		wrapper.find(".definition-header-title").at(0).simulate('click');
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Collapse specifications", () => {
		wrapper.find(".definition-header-title").at(1).simulate('click');
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Collapse social thresholds", () => {
		wrapper.find("#focusFeedDefinitionSocialThresholdSection .definition-header-title").at(0).simulate('click');
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Component snapshot with help info shwon", () => {
		wrapper.setState({ showHelpDialog: true });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Show help info click handler", () => {
		expect(wrapper.state().showHelpDialog).toBe(false);
		wrapper.find(".definition-header-search-show-help-link").simulate('click');
		expect(wrapper.state().showHelpDialog).toBe(true);
	});

	it("Help info dialog on close handler", () => {
		wrapper.setState({ showHelpDialog: true });
		expect(wrapper.state().showHelpDialog).toBe(true);
		wrapper.find("FocusFeedDefinitionHelpDialog").at(0).props().onClose();
		expect(wrapper.state().showHelpDialog).toBe(false);
	});

	it("Change main query", () => {
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onQueryChanged('input');
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
	});

	it("On check main query with normal query", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "girona" } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("girona");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(false);
	});

	it("On check main query with hashtag", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "#girona" } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("girona");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainScopeMock).toHaveBeenCalledWith(["tags"]);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(false);
	});

	it("On check main query with mention", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "@gironafc" } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("gironafc");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainScopeMock).toHaveBeenCalledWith(["mentions"]);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(false);
	});

	const queryValidationTests = [
		{ text: "On check main query with empty query", query: "", error: false },
		{ text: "On check main query with empty bad lucene query", query: "·ç", error: true },
		{ text: "On check main query not valid when tags or mentions", query: "a aa aaa", error: true },
		{ text: "On check main query with invalid characters", query: "b", error: true, scope: ["title"] },
		{ text: "On check main query with filed", query: "title:whatever", error: true },
		{ text: "On check main query with filed in right", query: "girona AND title:whatever", error: true }
	];

	for (const test of queryValidationTests) {
		it(test.text, () => {
			wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: test.query, scope: test.scope || ['tags'] } } });
			expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
			expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
			expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
			wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
			expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
			expect(onChangeMainQueryMock).toHaveBeenCalledWith(test.query);
			expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
			expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
			expect(onSetMainExpressionError).toHaveBeenCalledWith(test.error);
		});
	}

	it("On check main query with lucene parse fail", () => {
		const prevParse = lucene.parse;
		lucene.parse = () => { throw new Error(); };
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "girona" } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("girona");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(true);
		lucene.parse = prevParse;
	});

	it("On check main query with both hashtag and mention", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "#girona and @gironafc" } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("girona and gironafc");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainScopeMock).toHaveBeenCalledWith(["tags", "mentions"]);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(false);
	});

	it("On check main query without text scope removing quotes", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "'girona'" } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("girona");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(false);
	});

	it("On check main query with text scope not removing quotes", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "'girona'", scope: ["title", "content", "instagram.users_in_photo"] } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("'girona'");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(false);
	});

	it("On check main query with sensitive query", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "hola sen:adeu", scope: ["title", "content", "instagram.users_in_photo"] } } });
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onCheckQuery();
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith("hola sen:adeu");
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetMainExpressionError).toHaveBeenCalledTimes(1);
		expect(onSetMainExpressionError).toHaveBeenCalledWith(false);
	});

	it("Change main scope", () => {
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onScopeChanged('tags');
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
	});

	it("Change main scope with quoted query", () => {
		wrapper.setProps({ definition: { ...definition, main: { ...definition.main, q: "'girona'" } } });
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(0);
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onScopeChanged('tags');
		expect(onChangeMainScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeMainQueryMock).toHaveBeenCalledWith('girona');
	});

	it("Change main enable", () => {
		expect(onToggleEnableMainQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(0).props().onEnabledToggled(false);
		expect(onToggleEnableMainQueryMock).toHaveBeenCalledTimes(1);
	});

	it("Dispatch search", () => {
		wrapper.find('.definition-header-search-button').at(0).simulate('click');
		expect(onFetchSearch).toHaveBeenCalledTimes(1);
	});

	it("Change inclusive query", () => {
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(1).props().onQueryChanged('input');
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
	});

	it("Change inclusive enable", () => {
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(1).props().onEnabledToggled(false);
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(1);
	});

	it("Change inclusive scope", () => {
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(1).props().onScopeChanged('tags');
		expect(onChangeScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
	});

	it("Change inclusive scope updating query", () => {
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(2).props().onScopeChanged('tags');
		expect(onChangeScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
	});

	it("On check inclusive query with normal query", () => {
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetExpressionErrorMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(1).props().onCheckQuery();
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledWith("kketa", "include_expressions", 0);
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetExpressionErrorMock).toHaveBeenCalledTimes(1);
		expect(onSetExpressionErrorMock).toHaveBeenCalledWith(false, "include_expressions", 0);
	});

	it("On add inclusive expression", () => {
		expect(onAddExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('.definition-add-expression-button').at(0).simulate('click');
		expect(onAddExpressionMock).toHaveBeenCalledTimes(1);
		expect(onAddExpressionMock).toHaveBeenCalledWith("include_expressions");
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("On remove inclusive expression with query", () => {
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(1).props().onRemoveExpression();
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		expect(wrapper.state().showRemoveExpressionDialog).toStrictEqual(true);
		expect(wrapper.state().removeExpressionIndex).toStrictEqual(0);
		expect(wrapper.state().removeExpressionType).toStrictEqual('include_expressions');
	});

	it("On remove inclusive expression without query", () => {
		wrapper.setProps({ definition: { ...definition, include_expressions: [{ q: '', scope: ['tags'], enabled: true }] } });
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(1).props().onRemoveExpression();
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(1);
	});

	it("Change exclusive query", () => {
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(3).props().onQueryChanged('input');
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
	});

	it("Change exclusive enable", () => {
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(3).props().onEnabledToggled(false);
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(1);
	});

	it("Change exclusive scope", () => {
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(3).props().onScopeChanged('tags');
		expect(onChangeScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
	});

	it("Change exclusive scope updating query", () => {
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(4).props().onScopeChanged('tags');
		expect(onChangeScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
	});

	it("On check exclusive query with normal query", () => {
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetExpressionErrorMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(3).props().onCheckQuery();
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledWith("kketa", "exclude_expressions", 0);
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onSetExpressionErrorMock).toHaveBeenCalledTimes(1);
		expect(onSetExpressionErrorMock).toHaveBeenCalledWith(false, "exclude_expressions", 0);
	});

	it("Change exclusive scope with mentions query", () => {
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(5).props().onCheckQuery();
		expect(onChangeScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledWith('kketa', 'exclude_expressions', 2);
	});

	it("On add exclusive expression", () => {
		expect(onAddExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('.definition-add-expression-button').at(1).simulate('click');
		expect(onAddExpressionMock).toHaveBeenCalledTimes(1);
		expect(onAddExpressionMock).toHaveBeenCalledWith("exclude_expressions");
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it('On fetch instagram accounts called', () => {
		expect(onFetchInstagramAccounts).toHaveBeenCalledTimes(0);
		wrapper = getComponent({ instagramAccounts: null });
		expect(onFetchInstagramAccounts).toHaveBeenCalledTimes(1);
	});

	it('On remove expression dialog canceled', () => {
		wrapper.setState({ showRemoveExpressionDialog: true });
		wrapper.find('#focusFeedDefinitionRemoveExpressionWarning').at(0).props().onCancel();
		expect(wrapper.state().showRemoveExpressionDialog).toBe(false);
	});

	it('On remove expression dialog accepted', () => {
		wrapper.setState({ showRemoveExpressionDialog: true });
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('#focusFeedDefinitionRemoveExpressionWarning').at(0).props().onAccept();
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(1);
		expect(wrapper.state().showRemoveExpressionDialog).toBe(false);
	});

	it("On remove exclusive expression with query", () => {
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpression').at(5).props().onRemoveExpression();
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		expect(wrapper.state().showRemoveExpressionDialog).toStrictEqual(true);
		expect(wrapper.state().removeExpressionIndex).toStrictEqual(2);
		expect(wrapper.state().removeExpressionType).toStrictEqual('exclude_expressions');
	});

	it("On add inclusive profile", () => {
		expect(onAddProfileExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('.definition-add-expression-button').at(2).simulate('click');
		expect(onAddProfileExpressionMock).toHaveBeenCalledTimes(1);
		expect(onAddProfileExpressionMock).toHaveBeenCalledWith("include_profiles");
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Change inclusive profile", () => {
		expect(onChangeQueryProfileMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(0).props().onQueryChanged('input');
		expect(onChangeQueryProfileMock).toHaveBeenCalledTimes(1);
	});

	it("Search inclusive profile", () => {
		expect(onSearchProfileMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(0).props().onSearchProfile();
		expect(onSearchProfileMock).toHaveBeenCalledTimes(1);
	});

	it("Change inclusive profile enable", () => {
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(0).props().onEnabledToggled(false);
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(1);
	});

	it("On remove inclusive profile without query", () => {
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(1).props().onRemoveExpression();
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(1);
	});

	it("On remove inclusive profile", () => {
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(0).props().onRemoveExpression();
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(0);
	});

	it("On add exclusive profile", () => {
		expect(onAddProfileExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('.definition-add-expression-button').at(3).simulate('click');
		expect(onAddProfileExpressionMock).toHaveBeenCalledTimes(1);
		expect(onAddProfileExpressionMock).toHaveBeenCalledWith("exclude_profiles");
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Change exclusive profile", () => {
		expect(onChangeQueryProfileMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(2).props().onQueryChanged('input');
		expect(onChangeQueryProfileMock).toHaveBeenCalledTimes(1);
	});

	it("Search exclusive profile", () => {
		expect(onSearchProfileMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(2).props().onSearchProfile();
		expect(onSearchProfileMock).toHaveBeenCalledTimes(1);
	});

	it("Change exclusive profile enable", () => {
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(2).props().onEnabledToggled(false);
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(1);
	});

	it("On remove exclusive profile without query", () => {
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(3).props().onRemoveExpression();
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(1);
	});

	it("On remove exclusive profile", () => {
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialExpressionProfile').at(2).props().onRemoveExpression();
		expect(onRemoveProfileExpressionMock).toHaveBeenCalledTimes(0);
	});

	it("Threshold section warning display", () => {
		expect(wrapper.find('.threshold-section-warning').exists()).toEqual(true);
		wrapper.setProps({
			definition: {
				...definition,
				include_profiles: []
			}
		});
		expect(wrapper.find('.threshold-section-warning').exists()).toEqual(false);
	});

	it('Test threshold toggle check call', () => {
		wrapper.setProps({
			definition: {
				...definition,
				include_profiles: [],
				threshold: {
					30: {
						value: 500,
						enabled: false
					},
					40: {
						value: 0,
						enabled: false
					},
					51: {
						value: 0,
						enabled: false
					},
					60: {
						value: 0,
						enabled: false
					}
				}
			}
		});
		const threshold = wrapper.find("FocusFeedDefinitonSocialThreshold").at(0);
		threshold.props().onCheckToggled(true);
		expect(onSetThreshold).toHaveBeenCalledTimes(1);
		expect(onSetThreshold).toHaveBeenCalledWith(30, { value: 500, enabled: true });
	});

	it('Test threshold value change calls', () => {
		wrapper.setProps({
			definition: {
				...definition,
				include_profiles: [],
				threshold: {
					30: {
						value: 500,
						enabled: true
					},
					40: {
						value: 0,
						enabled: false
					},
					51: {
						value: 0,
						enabled: false
					},
					60: {
						value: 0,
						enabled: false
					}
				}
			}
		});
		const threshold = wrapper.find("FocusFeedDefinitonSocialThreshold").at(0);
		threshold.props().onValueChanged('');
		expect(onSetThreshold).toHaveBeenCalledWith(30, {
			value: '',
			error: true,
			enabled: true,
			errorMessage: 'feed.form.threshold.invalid_value'
		});

		threshold.props().onValueChanged(10);
		expect(onSetThreshold).toHaveBeenCalledWith(30, {
			value: 10,
			error: true,
			enabled: true,
			errorMessage: 'feed.form.threshold.invalid_min_value'
		});

		threshold.props().onValueChanged(600);
		expect(onSetThreshold).toHaveBeenCalledWith(30, {
			value: 600,
			enabled: true
		});
	});
});
