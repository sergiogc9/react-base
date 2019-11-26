import { mount } from "enzyme";
import React from "react";
import SearchPaginator from "@src/components/Search/Paginator/SearchPaginator";
import GA from '@src/lib/googleAnalytics';

let onSetStartMock: any;

describe("Search Form", () => {
	let wrapper: any;

	beforeEach(() => {
		onSetStartMock = jest.fn();
	});

	it("Test component snapshot loading results", () => {
		wrapper = mount(
			<SearchPaginator
				limit={20}
				start={0}
				total={0}
				onSetStart={onSetStartMock}
				loadingDocuments={true}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot loading results without results", () => {
		wrapper = mount(
			<SearchPaginator
				limit={20}
				start={0}
				total={0}
				onSetStart={onSetStartMock}
				loadingDocuments={false}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot 5000 results", () => {
		wrapper = mount(
			<SearchPaginator
				limit={20}
				start={0}
				total={5000}
				onSetStart={onSetStartMock}
				loadingDocuments={false}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test component snapshot > 5000 results", () => {
		wrapper = mount(
			<SearchPaginator
				limit={20}
				start={0}
				total={6000}
				onSetStart={onSetStartMock}
				loadingDocuments={false}
			/>
		);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test change page", () => {
		GA.trackEvent = jest.fn();
		wrapper = mount(
			<SearchPaginator
				limit={20}
				start={0}
				total={5000}
				onSetStart={onSetStartMock}
				loadingDocuments={false}
			/>
		);
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		expect(onSetStartMock).toHaveBeenCalledTimes(0);
		wrapper.find("#paginator button").at(0).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		expect(onSetStartMock).toHaveBeenCalledTimes(0);
		wrapper.find("#paginator button").at(1).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
		expect(onSetStartMock).toHaveBeenCalledTimes(1);
	});

	it("Test change prev page", () => {
		wrapper = mount(
			<SearchPaginator
				limit={20}
				start={20}
				total={5000}
				onSetStart={onSetStartMock}
				loadingDocuments={false}
			/>
		);
		expect(onSetStartMock).toHaveBeenCalledTimes(0);
		wrapper.find("#paginator button").at(0).simulate('click');
		expect(onSetStartMock).toHaveBeenCalledTimes(1);
	});

	it("Test change next page", () => {
		wrapper = mount(
			<SearchPaginator
				limit={20}
				start={0}
				total={5000}
				onSetStart={onSetStartMock}
				loadingDocuments={false}
			/>
		);
		expect(onSetStartMock).toHaveBeenCalledTimes(0);
		wrapper.find("#paginator button").at(6).simulate('click');
		expect(onSetStartMock).toHaveBeenCalledTimes(1);
	});

});
