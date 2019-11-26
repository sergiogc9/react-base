import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import DocumentItem from '@src/components/common/Document/Item/DocumentItem';
import GA from '@src/lib/googleAnalytics';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const document = TestHelper.getPreparedDocument();

describe("Document item tests", () => {

	let wrapper: ShallowWrapper;

	beforeEach(() => {
		wrapper = shallow(<DocumentItem document={document} />);
	});

	it("Test document title tracker", () => {
		GA.trackEvent = jest.fn();
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('.document-item-content a').at(0).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Test document content tracker", () => {
		GA.trackEvent = jest.fn();
		expect(GA.trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('.document-item-content a').at(1).simulate('click');
		expect(GA.trackEvent).toHaveBeenCalledTimes(1);
	});
});
