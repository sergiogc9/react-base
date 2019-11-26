import reactga from 'react-ga';

import GA, { GoogleAnalyticsTrackEvent } from '@src/lib/googleAnalytics';

let initMock: jest.Mock;
let trackPageMock: jest.Mock;
let trackEventMock: jest.Mock;
let trackTimingMock: jest.Mock;

describe('googleAnalytics', () => {

	beforeEach(() => {
		initMock = jest.fn();
		trackPageMock = jest.fn();
		trackEventMock = jest.fn();
		trackTimingMock = jest.fn();
		reactga.initialize = initMock;
		reactga.event = trackEventMock;
		reactga.pageview = trackPageMock;
		reactga.timing = trackTimingMock;
	});

	it("should initialize", () => {
		GA.init();
		expect(initMock).toHaveBeenCalledTimes(1);
		expect(initMock).toHaveBeenCalledWith([{
			trackingId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID!,
			titleCase: false,
			gaOptions: {
				siteSpeedSampleRate: 100
			}
		}]);
	});

	it("should send event", () => {
		const fakeEvent: GoogleAnalyticsTrackEvent = { category: "category", action: "action", label: "label" };
		GA.trackEvent(fakeEvent);
		expect(trackEventMock).toHaveBeenCalledTimes(1);
		expect(trackEventMock).toHaveBeenCalledWith(fakeEvent);
	});

	it("should send pageview", () => {
		const page = "/fake";
		GA.trackPage(page);
		expect(trackPageMock).toHaveBeenCalledTimes(1);
		expect(trackPageMock).toHaveBeenCalledWith(page);
	});

	it("should send timing", () => {
		const start = new Date(0);
		const getTime = Date.prototype.getTime;
		start.getTime = () => 0;
		Date.prototype.getTime = () => 10000;
		const category = "category";
		const variable = "var";
		const label = "label";
		GA.endTimer(start, category, variable, label);
		expect(trackTimingMock).toHaveBeenCalledTimes(1);
		expect(trackTimingMock).toHaveBeenCalledWith({ category, variable, value: 10000, label });
		Date.prototype.getTime = getTime;
	});

});
