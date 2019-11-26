import React from "react";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';

import Image from '@src/components/common/Image/Image';

let setLoadFailed = jest.fn();

const mockSetLoad = (loaded: boolean) => {
	jest
		.spyOn(React, 'useState')
		.mockImplementation(() => [loaded, setLoadFailed]);
};

describe("Image common component", () => {
	let wrapper: any;
	const getComponent = () => (
		<Image
			url="http://fakeurl.com"
			fallbackUrl="http://fallback.fake.url"
		/>
	);

	const shallowWrapper = (component?: JSX.Element) => {
		act(() => { wrapper = mount(component || getComponent()); });
	};

	beforeEach(() => {
		setLoadFailed = jest.fn();
		mockSetLoad(false);
		shallowWrapper();
	});

	it("Component default snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with fallbackUrl", () => {
		mockSetLoad(true);
		shallowWrapper();
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with component fallback", () => {
		mockSetLoad(true);
		wrapper.setProps({ fallbackUrl: undefined, fallbackComponent: <div>Fallback component</div> });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot with component fallback in children", () => {
		mockSetLoad(true);
		shallowWrapper(<Image url="http://fakeurl.com"><div>Fallback component in children</div></Image>);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Image url handler modifies state", () => {
		wrapper.find('img').props().onError({ target: {} });
		expect(setLoadFailed).toHaveBeenCalledWith(true);
	});

	it("loadFailed set as false when modifying url prop", () => {
		mockSetLoad(true);
		wrapper.setProps({ url: "http://another-fake.url" });
		expect(setLoadFailed).toHaveBeenCalledWith(false);
		wrapper.unmount();
	});
});
