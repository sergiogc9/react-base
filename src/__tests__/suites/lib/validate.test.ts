import { isYoutubeDocumentUrl } from "@src/lib/validate";

describe('Validate method tests', () => {

	it('Test correct youtube document urls', () => {
		expect(isYoutubeDocumentUrl('https://www.youtube.com/watch?v=Wapb_LIS45E')).toBe(true);
		expect(isYoutubeDocumentUrl('http://www.youtube.com/watch?v=Wapb_LIS45E')).toBe(true);
		expect(isYoutubeDocumentUrl('http://www.youtube.com/watch?v=Wapb_LIS45E')).toBe(true);
		expect(isYoutubeDocumentUrl('https://youtube.com/watch?v=Wapb_LIS45E')).toBe(true);
	});

	it('Test incorrect youtube document urls', () => {
		expect(isYoutubeDocumentUrl('https://www.youtube1.com/watch?v=Wapb_LIS45E')).toBe(false);
		expect(isYoutubeDocumentUrl('http://www.youtube.com/watch?v')).toBe(false);
		expect(isYoutubeDocumentUrl('www.youtube.com/watch?v=Wapb_LIS45E')).toBe(false);
	});
});
