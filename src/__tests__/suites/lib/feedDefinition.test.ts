import { socialDefinitionThresholdCapturePrediction } from '@src/lib/feedDefinition';

const twitterChannel = 30;
const youtubeChannel = 40;
const instagramChannel = 51;
const facebookChannel = 60;

describe("Test feed definition utilities", () => {
	it("Test social definition threshold capture prediction when value is empty", () => {
		expect(socialDefinitionThresholdCapturePrediction('', twitterChannel)).toEqual(undefined);
	});

	it("Test social definition threshold capture prediction when value is negative", () => {
		expect(socialDefinitionThresholdCapturePrediction(-100, twitterChannel)).toEqual(undefined);
	});

	it("Test social definition threshold capture prediction when value is 0", () => {
		expect(socialDefinitionThresholdCapturePrediction(0, twitterChannel)).toEqual("100");
		expect(socialDefinitionThresholdCapturePrediction(0, youtubeChannel)).toEqual("100");
		expect(socialDefinitionThresholdCapturePrediction(0, instagramChannel)).toEqual("100");
		expect(socialDefinitionThresholdCapturePrediction(0, facebookChannel)).toEqual("100");
	});

	it("Test social definition threshold capture predictions", () => {
		expect(socialDefinitionThresholdCapturePrediction(5, twitterChannel)).toEqual("97.5");
		expect(socialDefinitionThresholdCapturePrediction(48, youtubeChannel)).toEqual("28.14");
		expect(socialDefinitionThresholdCapturePrediction(10080, instagramChannel)).toEqual("23.25");
		expect(socialDefinitionThresholdCapturePrediction(99999999, facebookChannel)).toEqual("0.02");
		expect(socialDefinitionThresholdCapturePrediction(100000000, facebookChannel)).toEqual("0");
	});
});
