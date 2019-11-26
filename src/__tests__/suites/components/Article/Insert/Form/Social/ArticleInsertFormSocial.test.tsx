import React from "react";
import { act } from 'react-dom/test-utils';
import mockDate from 'mockdate';

import ArticleInsertFormSocial from "@src/components/Article/Insert/Form/Social/ArticleInsertFormSocial";
import { ComponentProps } from "@src/components/Article/Insert/Form/Social/types";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";
import Api from "@src/lib/ajax/Api";

const user = TestHelper.getUser();

let onValidationSuccess = jest.fn();
let onValidationError = jest.fn();

describe("Text field common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = TestHelper.getWrappedComponent(
				<ArticleInsertFormSocial
					url="https://www.instagram.com/p/B4H3CguiBtY/"
					loading={false}
					submit={false}
					onValidationSuccess={onValidationSuccess}
					onValidationError={onValidationError}
					{...props}
				/>, { app: { profile: { user } } }).component;
		});
	};

	beforeAll(() => {
		mockDate.set(new Date("2019-10-28"));
	});

	afterAll(() => {
		mockDate.reset();
	});

	beforeEach(() => {
		onValidationSuccess = jest.fn();
		onValidationError = jest.fn();
		updateComponent();
	});

	it("Component default snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with youtube url", () => {
		updateComponent({ url: "https://www.youtube.com/watch?v=Wapb_LIS45E" });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with loading", () => {
		updateComponent({ loading: true });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot after adding tags", () => {
		act(() => wrapper.find("Categorization").at(0).props().onAddTags(["tag1", "tag2"]));
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot after removing tags", () => {
		act(() => wrapper.find("Categorization").at(0).props().onAddTags(["tag1", "tag2"]));
		act(() => wrapper.find("Categorization").at(0).props().onRemoveTag("tag1"));
		expect(wrapper.html()).toMatchSnapshot();
	});

	// TODO: Do it. It was impossible to test it. (It was impossible to do setProps...)
	// it("Component on submit change", () => {

	// });

});
