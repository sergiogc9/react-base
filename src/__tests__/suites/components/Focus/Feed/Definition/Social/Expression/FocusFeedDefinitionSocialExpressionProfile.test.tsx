import React from "react";
import { mount, shallow } from "enzyme";

import FocusFeedDefinitionSocialExpressionProfile from "@src/components/Focus/Feed/Definition/Social/Expression/FocusFeedDefinitionSocialExpressionProfile";

const query = "http://kketa.com";
const enabled = false;
const expressionKey = "expr1";

describe("Definition social expression profile", () => {
	let wrapper: any;
	let onChangeQueryMock = jest.fn();
	let onToggleEnableQueryMock = jest.fn();
	let onRemoveExpressionMock = jest.fn();
	let onSearchProfileMock = jest.fn();

	const getComponent = () => (
		<FocusFeedDefinitionSocialExpressionProfile
			expressionKey={expressionKey}
			index={0}
			loading={false}
			query={query}
			enabled={enabled}
			channel_type={30}
			avatar={'http://fakeAvatar'}
			name={'Fake name'}
			onQueryChanged={onChangeQueryMock}
			onEnabledToggled={onToggleEnableQueryMock}
			onRemoveExpression={onRemoveExpressionMock}
			onSearchProfile={onSearchProfileMock}
		/>
	);

	beforeEach(() => {
		onChangeQueryMock = jest.fn();
		onToggleEnableQueryMock = jest.fn();
		onRemoveExpressionMock = jest.fn();
		onSearchProfileMock = jest.fn();
		wrapper = shallow(getComponent());
	});

	[30, 40, 51, 60, 0].forEach(provider => {
		const component = shallow(<FocusFeedDefinitionSocialExpressionProfile
			expressionKey={expressionKey}
			index={0}
			loading={true}
			query={query}
			enabled={enabled}
			channel_type={provider}
			avatar={'http://fakeAvatar'}
			name={'Fake name'}
			onQueryChanged={onChangeQueryMock}
			onEnabledToggled={onToggleEnableQueryMock}
			onRemoveExpression={onRemoveExpressionMock}
			onSearchProfile={onSearchProfileMock}
		/>);
		it(`Component default snaphsot with provider ${provider}`, () => {
			expect(component.html()).toMatchSnapshot();
		});
	});

	it("Component default snaphsot loading profile", () => {
		const component = shallow(<FocusFeedDefinitionSocialExpressionProfile
			expressionKey={expressionKey}
			index={0}
			loading={true}
			query={query}
			enabled={enabled}
			channel_type={30}
			avatar={'http://fakeAvatar'}
			name={'Fake name'}
			onQueryChanged={onChangeQueryMock}
			onEnabledToggled={onToggleEnableQueryMock}
			onRemoveExpression={onRemoveExpressionMock}
			onSearchProfile={onSearchProfileMock}
		/>);
		expect(component.html()).toMatchSnapshot();
	});

	it("Component default snaphsot with error", () => {
		wrapper.setProps({ error: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component default snaphsot with and index higher than 0", () => {
		wrapper.setProps({ index: 1 });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component default snaphsot with query enabled", () => {
		wrapper.setProps({ enabled: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Focus query input if query is empty", () => {
		// TODO FIX!
		const component = mount(<FocusFeedDefinitionSocialExpressionProfile
			expressionKey={expressionKey}
			index={0}
			loading={false}
			query={""}
			enabled={true}
			channel_type={30}
			avatar={'http://fakeAvatar'}
			name={'Fake name'}
			onQueryChanged={onChangeQueryMock}
			onEnabledToggled={onToggleEnableQueryMock}
			onRemoveExpression={onRemoveExpressionMock}
			onSearchProfile={onSearchProfileMock}
		/>);
		expect(component.html()).toMatchSnapshot();
	});

	it("On toggle enabled query handler", () => {
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find(`#focusFeedDefinitionSocialExpressionProfileEnabled${expressionKey}0`).at(0).props().onChange(false);
		expect(onToggleEnableQueryMock).toHaveBeenCalledTimes(1);
		expect(onToggleEnableQueryMock).toHaveBeenCalledWith(false);
	});

	it("On search profile by query handler without changing query", () => {
		expect(onSearchProfileMock).toHaveBeenCalledTimes(0);
		wrapper.find(`TextField#focusFeedSocialExpressionProfileQuery${expressionKey}0`).at(0).props().onBlur();
		expect(onSearchProfileMock).toHaveBeenCalledTimes(0);
	});

	it("On search profile by query handler changing query", () => {
		expect(onSearchProfileMock).toHaveBeenCalledTimes(0);
		wrapper.setState({unsearchedQuery: 'kketa'});
		wrapper.find(`TextField#focusFeedSocialExpressionProfileQuery${expressionKey}0`).at(0).props().onBlur();
		expect(onSearchProfileMock).toHaveBeenCalledTimes(1);
	});

	it("On change query handler", () => {
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find(`TextField#focusFeedSocialExpressionProfileQuery${expressionKey}0`).at(0).props().onChange({val: 'kketa'});
		expect(onChangeQueryMock).toHaveBeenCalledTimes(1);
	});

	it("On remove expression", () => {
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(0);
		wrapper.find('.definition-expression-remove-button').at(0).simulate('click');
		expect(onRemoveExpressionMock).toHaveBeenCalledTimes(1);
	});

	it("On simulate submit query", () => {
		expect(onSearchProfileMock).toHaveBeenCalledTimes(0);
		wrapper.setState({unsearchedQuery: 'kketa'});
		wrapper.find(`TextField#focusFeedSocialExpressionProfileQuery${expressionKey}0`).at(0).simulate('keydown', { keyCode: 13 });
		expect(onSearchProfileMock).toHaveBeenCalledTimes(1);
	});

	it("On simulate submit query with non enter key", () => {
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
		wrapper.find(`TextField#focusFeedSocialExpressionProfileQuery${expressionKey}0`).at(0).simulate('keydown', { keyCode: 120 });
		expect(onChangeQueryMock).toHaveBeenCalledTimes(0);
	});
});
