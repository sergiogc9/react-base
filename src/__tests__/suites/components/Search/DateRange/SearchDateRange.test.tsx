import { shallow } from "enzyme";
import moment from 'moment';
import React from "react";
import SearchDateRange from "@src/components/Search/DateRange/SearchDateRange";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const user = TestHelper.getUser();

let onSetBeginDate: any;
let onSetEndDate: any;

const beginDate = moment().startOf('day').subtract(1, 'week').toDate();
const endDate = moment().endOf('day').toDate();

describe("<SerachDateRange />", () => {
	let wrapper: any;

	beforeEach(() => {
		onSetBeginDate = jest.fn();
		onSetEndDate = jest.fn();
		wrapper = shallow(<SearchDateRange
			user={user}
			beginDate={null}
			endDate={null}
			onSetBeginDate={onSetBeginDate}
			onSetEndDate={onSetEndDate}
		/>);
	});

	it("Test component snapshot", () => {
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Test with custom date ranges", () => {
		wrapper.setProps({ beginDate, endDate });
		expect(wrapper.debug()).toMatchSnapshot();
	});

	it("Test date pickers change ", () => {
		wrapper.setProps({ searchPeriod: "custom", beginDate, endDate });
		expect(onSetBeginDate).toHaveBeenCalledTimes(0);
		wrapper.find('#searchDateRangeBeginDate').at(0).props().onChange(new Date());
		expect(onSetBeginDate).toHaveBeenCalledTimes(1);

		expect(onSetEndDate).toHaveBeenCalledTimes(0);
		wrapper.find('#searchDateRangeEndDate').at(0).props().onChange(new Date());
		expect(onSetEndDate).toHaveBeenCalledTimes(1);
	});
});
