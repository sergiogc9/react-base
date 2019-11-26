import { getCurrentPage, isCurrentPage } from "@src/lib/pathCheck";

describe('url page related tests', () => {

	it("getCurrentPage should return correct page", () => {
		expect(getCurrentPage("/article")).toBe("article");
		expect(getCurrentPage("/article?query=blabla&sort=test")).toBe("article");
		expect(getCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A")).toBe("preview");
		expect(getCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/online")).toBe("preview");
		expect(getCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/socialmedia")).toBe("preview");
		expect(getCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/print")).toBe("preview");
		expect(getCurrentPage("other-page")).toBe("other");
	});

	it("isCurrentPage should return true", () => {
		expect(isCurrentPage("/article", "article")).toBe(true);
		expect(isCurrentPage("/article?query=blabla&sort=test", "article")).toBe(true);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A", "preview")).toBe(true);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/online", "preview")).toBe(true);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/socialmedia", "preview")).toBe(true);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/print", "preview")).toBe(true);
	});

	it("isCurrentPage should return false", () => {
		expect(isCurrentPage("/article", "preview")).toBe(false);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A", "article")).toBe(false);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/online", "article")).toBe(false);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/socialmedia", "article")).toBe(false);
		expect(isCurrentPage("/focus/9D1F7014-A8D2-11E7-8A56-E8D3AF37362A/feed/create/print", "article")).toBe(false);
	});

});
