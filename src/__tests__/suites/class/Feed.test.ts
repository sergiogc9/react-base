import { DocumentObject } from '@src/class/Document';
import { FeedObject, Feed } from '@src/class/Feed';
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

describe('feed class', () => {

	it('should create a new empty feed', () => {
		const f = new Feed();
		expect(f.id).toBeUndefined();
	});

	it('should create a new Feed with id', () => {
		const f = new Feed({ id: feed.id });
		expect(f.id).toEqual(feed.id);
	});

	it('should create a new Feed with all data', () => {
		const f = new Feed(feed);
		expect(f).toMatchObject(feed);
	});
});
