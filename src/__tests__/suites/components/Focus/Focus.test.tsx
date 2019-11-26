import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import merge from "lodash/merge";
import { MemoryRouter } from "react-router";

import FocusList from "@src/components/Focus/List";
import FocusFeed from "@src/components/Focus/Feed";
import Focus from "@src/components/Focus";
import { INITIAL_STATE } from "@src/store";

const mockStore = configureMockStore();

function getWrappedComponent(component: JSX.Element, stateSlice: object) {
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	return mount(<Provider store={store}>{component}</Provider>);
}

let redirectMock = jest.fn();
describe("Focus", () => {

	beforeAll(() => {
		Object.defineProperty(window.location, 'assign', {
			configurable: true,
		});
		window.matchMedia = jest.fn((query: string) => ({
			matches: query.indexOf('(min-width: 1025px)') !== -1,
		}));
	});

	beforeEach(() => {
		redirectMock = jest.fn();
		window.location.assign = redirectMock;
	});

	it("should render online feed page", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus/5BF02FCC-F9BC-11E6-816F-FD9F63F109A7/feed/create/online']}><Focus /></MemoryRouter>, {});
		// Change span for component when implemented
		expect(wrapper.find(FocusFeed)).toHaveLength(0);
		expect(redirectMock).toHaveBeenCalledTimes(1);
	});

	it("should render social feed page", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus/5BF02FCC-F9BC-11E6-816F-FD9F63F109A7/feed/create/socialmedia']}><Focus /></MemoryRouter>, {});
		expect(wrapper.find(FocusFeed)).toHaveLength(1);
	});

	it("should render print feed page", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus/5BF02FCC-F9BC-11E6-816F-FD9F63F109A7/feed/create/print']}><Focus /></MemoryRouter>, {});
		// Change span for component when implemented
		expect(wrapper.find(FocusFeed)).toHaveLength(0);
		expect(redirectMock).toHaveBeenCalledTimes(1);
	});

	it("should render feed page", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus/5BF02FCC-F9BC-11E6-816F-FD9F63F109A7/feed/5BF02FCC-F9BC-11E6-816F-FD9F63F109A7']}><Focus /></MemoryRouter>, {});
		// Change span for component when implemented
		expect(wrapper.find('FocusFeed')).toHaveLength(1);
	});

	it("should render focus page", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus/5BF02FCC-F9BC-11E6-816F-FD9F63F109A7']}><Focus /></MemoryRouter>, {});
		// Change span for component when implemented
		expect(redirectMock).toHaveBeenCalledTimes(1);
	});

	it("should redirect to focus page", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus/5BF02FCC-F9BC-11E6-816F-FD9F63F109A7/useless/data/']}><Focus /></MemoryRouter>, {});
		// Change span for component when implemented
		expect(redirectMock).toHaveBeenCalledTimes(1);
	});

	it("should render FocusList", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus']}><Focus /></MemoryRouter>, {});
		expect(wrapper.find(FocusList)).toHaveLength(1);
	});

	it("should redirect to FocusList", () => {
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/focus/useless/data/']}><Focus /></MemoryRouter>, {});
		expect(wrapper.find(FocusList)).toHaveLength(1);
	});
});
