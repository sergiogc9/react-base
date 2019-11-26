import React from "react";
import { shallow, mount } from "enzyme";

import FocusFeedDefinitionSocialExpression from "@src/components/Focus/Feed/Definition/Social/Expression/FocusFeedDefinitionSocialExpression";
import { ScopeSocial, SocialInstagramAccount, DefinitionSocialInstagramAccount } from "@src/class/Feed";

const query = "kketa";
const enabled = false;
const scope: ScopeSocial[] = ['tags'];
const expressionKey = "include_expressions";

const instagramAccount: SocialInstagramAccount = {
	id: "id1",
	name: "Girona FC",
	profile_picture_url: "fakeurl.com",
	screen_name: "gironafc",
	valid: true
};
const instagramAccounts: SocialInstagramAccount[] = [instagramAccount];
const mainDefinitionInstagramAccount: DefinitionSocialInstagramAccount = {
	id: "id1",
	screen_name: "gironafc",
	linkedExpression: { type: "main", index: 0 }
};
const includeDefintionInstagramAccount: DefinitionSocialInstagramAccount = {
	id: "id1",
	screen_name: "gironafc",
	linkedExpression: { type: "include_expressions", index: 0 }
};

describe("Definition social expression", () => {
	let wrapper: any;
	let onChangeQueryMock = jest.fn();
	let onCheckQueryMock = jest.fn();
	let onChangeScopeMock = jest.fn();
	let onToggleEnableQueryMock = jest.fn();
	let onRemoveExpressionMock = jest.fn();

	const getComponent = () => (
		<FocusFeedDefinitionSocialExpression
			expressionKey={expressionKey}
			index={0}
			query={query}
			enabled={enabled}
			scope={scope}
			instagramAccounts={instagramAccounts}
			definitionInstagramAccounts={[]}
			onQueryChanged={onChangeQueryMock}
			onCheckQuery={onCheckQueryMock}
			onEnabledToggled={onToggleEnableQueryMock}
			onScopeChanged={onChangeScopeMock}
			onRemoveExpression={onRemoveExpressionMock}
		/>
	);

	beforeEach(() => {
		onChangeQueryMock = jest.fn();
		onCheckQueryMock = jest.fn();
		onChangeScopeMock = jest.fn();
		onToggleEnableQueryMock = jest.fn();
		onRemoveExpressionMock = jest.fn();
		wrapper = shallow(getComponent());
	});

	it("Component default snaphsot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component default snaphsot with error", () => {
		wrapper.setProps({ error: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component default snaphsot being main expression", () => {
		wrapper.setProps({ expressionKey: "main" });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component default snaphsot with query enabled", () => {
		wrapper.setProps({ enabled: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("On toggle enabled query handler", () => {
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find(`#focusFeedDefinitionSocialExpressionEnabled${expressionKey}0`).at(0).props().onChange(false);
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(1);
		expect(onToggleEnableQueryMock).toHaveBeenCalledWith(false);
	});

	it("On change query handler", () => {
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find(`TextField#focusFeedSocialExpressionQuery${expressionKey}0`).at(0).props().onChange('queryy');
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
		expect(onChangeQueryMock).toHaveBeenCalledWith("queryy");
	});

	it("On blur query query handler", () => {
		expect(onCheckQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find(`TextField#focusFeedSocialExpressionQuery${expressionKey}0`).at(0).props().onBlur();
		expect(onCheckQueryMock).toHaveBeenCalledTimes(1);
		expect(onCheckQueryMock).toHaveBeenCalledWith();
	});

	it("On toggle enabled query handler", () => {
		expect(onChangeScopeMock).toHaveBeenCalledTimes(0);
		wrapper.find(`#focusFeedSocialDefinitionExpressionScope${expressionKey}0`).at(0).props().onChange(['tags']);
		expect(onChangeScopeMock).toHaveBeenCalledTimes(1);
		expect(onChangeScopeMock).toHaveBeenCalledWith(['tags']);
	});

	it("On remove expression", () => {
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('.definition-expression-remove-button').at(0).simulate('click');
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(1);
	});

	it("On remove unremovible expression", () => {
		wrapper = shallow(<FocusFeedDefinitionSocialExpression
			expressionKey={expressionKey}
			index={0}
			query={query}
			enabled={enabled}
			scope={scope}
			onQueryChanged={onChangeQueryMock}
			onCheckQuery={onCheckQueryMock}
			onEnabledToggled={onToggleEnableQueryMock}
			onScopeChanged={onChangeScopeMock}
			instagramAccounts={instagramAccounts}
			definitionInstagramAccounts={[]}
		/>);
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('.definition-expression-remove-button').at(0).simulate('click');
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
	});

	it("Component snapshot with selected instagram account", () => {
		wrapper.setProps({ definitionInstagramAccounts: [includeDefintionInstagramAccount] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Selected instagram account on clicked handler", () => {
		const onInstagramAccountToggled = jest.fn();
		wrapper.setProps({ definitionInstagramAccounts: [includeDefintionInstagramAccount], onInstagramAccountToggled });
		expect(onInstagramAccountToggled).toHaveBeenCalledTimes(0);
		wrapper.find('FocusFeedDefinitionSocialInstagramAccount').at(0).props().onSelected();
		expect(onInstagramAccountToggled).toHaveBeenCalledTimes(1);
		expect(onInstagramAccountToggled).toHaveBeenCalledWith({
			id: includeDefintionInstagramAccount.id,
			screen_name: includeDefintionInstagramAccount.screen_name,
			linkedExpression: { type: expressionKey, index: 0 }
		});
	});

	it("Component snapshot with selected instagram account but without instagram accounts loaded", () => {
		wrapper.setProps({ instagramAccounts: null, definitionInstagramAccounts: [includeDefintionInstagramAccount] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot showing instagram accounts list", () => {
		wrapper.setProps({ scope: ["mentions"] });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Focus query input if query is empty", () => {
		// TODO FIX!
		const component = mount(<FocusFeedDefinitionSocialExpression
			expressionKey={expressionKey}
			index={0}
			query={""}
			enabled={enabled}
			scope={scope}
			instagramAccounts={instagramAccounts}
			definitionInstagramAccounts={[]}
			onQueryChanged={onChangeQueryMock}
			onCheckQuery={onCheckQueryMock}
			onEnabledToggled={onToggleEnableQueryMock}
			onScopeChanged={onChangeScopeMock}
			onRemoveExpression={onRemoveExpressionMock}
		/>);
		expect(component.html()).toMatchSnapshot();
	});
});
