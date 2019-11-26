import React from "react";
import { mount } from "enzyme";
import DocumentItemImage, { OwnProps as ComponentProps } from '@src/components/common/Document/Item/DocumentItemImage/DocumentItemImage';
import GA from '@src/lib/googleAnalytics';

function getWrapperWithProps(props: ComponentProps) {
	return mount(<DocumentItemImage {...props} ></DocumentItemImage>);
}

describe("Document item images", () => {

	let wrapper: any;

	beforeEach(() => {
		wrapper = getWrapperWithProps({
			mainImage: "fake",
			mainLink: "http://discover.sprint.launchmetrics.com/r/d/2GT8E24urGs=_ckkDAAAAAAAAAAAAAAAAAA==",
			secondaryImage: "fake",
			secondaryLink: "http://discover.sprint.launchmetrics.com/r/d/2GT8E24urGs=_ckkDAAAAAAAAAAAAAAAAAA==?cover=1",
		});
	});

	it("Should render two images", () => {
		expect(wrapper.find('.document-item-image-link')).toHaveLength(2);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Should render one image", () => {
		wrapper.setProps({
			secondaryImage: "",
			secondaryLink: ""
		});
		expect(wrapper.find('.document-item-image-link')).toHaveLength(1);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Should not render any image", () => {
		wrapper.setProps({
			mainImage: "",
			mainLink: "",
			secondaryImage: "",
			secondaryLink: ""
		});
		wrapper.find('img').simulate('error');
		expect(wrapper.contains('img')).toBe(false);
	});

	it("Should change active image", () => {
		wrapper.find(".document-item-image-link[type='secondary']").simulate('click');
		expect(wrapper.state("activeImage")).toBe('secondary');
	});

	it("Should not change active image", () => {
		const prevActiveImage = wrapper.state("activeImage");
		wrapper.find(".document-item-image-link.active-image").simulate('click');
		expect(wrapper.state("activeImage")).toBe(prevActiveImage);
	});

	it("Test image tracker", () => {
		GA.trackEvent = jest.fn();
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find(".document-item-image-link.active-image").simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});
});
