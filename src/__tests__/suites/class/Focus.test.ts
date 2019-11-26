import { Focus, FocusFeeds, FocusObject } from '@src/class/Focus';
import { FeedObject } from '@src/class/Feed';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const document = TestHelper.getDocument();

const feed: FeedObject = {
	definition: {},
	deleted_at: new Date(1549287550563),
	enabled: true,
	filters: {},
	focus_id: "focus-id-1",
	id: "feed-id-1",
	inserted_at: new Date(1549287550563),
	name: "feed-name-1",
	oldest_document: document,
	type: "online",
	updated_at: new Date(1549287550563)
};

const feed2: FeedObject = {
	...feed,
	id: "feed-id-2",
	name: "feed-name-2",
	type: "socialmedia",
};

const feedOnlineNameUppercase: FeedObject = {
	...feed,
	id: "feed-id-uppercase",
	name: "Feed-name-2 uppercase",
};

const focusFeeds: FocusFeeds = {
	online: [feed, feedOnlineNameUppercase],
	socialmedia: [feed2],
	print: []
};

const focus: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: focusFeeds,
	id: "focus-id-1",
	inserted_at: new Date(1549287550563),
	name: "focus-name-1",
	oldest_document: document,
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url.com"
};

const focus2: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: undefined,
	id: "focus-id-2",
	inserted_at: new Date(1549287550563),
	name: "focus-name-2",
	oldest_document: document,
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url2.com"
};

const focusAPI: { entities: { feed: FeedObject[] } } = {
	...focus,
	entities: { feed: [feed, feed2, feedOnlineNameUppercase] }
};

const focusList: FocusObject[] = [focus, focus2];

describe('focus class', () => {

	it('should create a new empty focus', () => {
		const f = new Focus();
		expect(f.id).toBeUndefined();
	});

	it('should create a new Focus with id', () => {
		const f = new Focus({ id: focus.id });
		expect(f.id).toEqual(focus.id);
	});

	it('should create a new Focus with all data', () => {
		const f = new Focus(focus);
		expect(f).toMatchObject(focus);
	});

	it('should return ordered feeds', () => {
		const f = new Focus(focus);
		expect(f.getFeeds()).toEqual([feed, feed2, feedOnlineNameUppercase]);
	});

	it('should transform an API response', () => {
		expect(Focus.transformEntitiesResponse(focusAPI.entities.feed)).toMatchObject(focus.feeds as FocusFeeds);
	});

	it('should get a feed from focus list', () => {
		expect(Focus.findFeedInFocusList('feed-id-1', focusList)).toMatchObject(feed);
	});

	it('should return null finding a feed from focus list', () => {
		expect(Focus.findFeedInFocusList('not-existing-feed-id', focusList)).toBe(null);
	});

});
