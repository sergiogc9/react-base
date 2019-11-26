import moment from "moment";

import { getPeriodParams, getInsertMentionSearchParams, getArticleSearchParams, getPreviewSearchParams, getArticleSearchFacetsParams, getPreviewSearchFacetsParams } from "@src/lib/searchParams";
import { State as FormSate } from "@src/store/search/form";
import { State as FiltersState } from "@src/store/search/filters";
import { State as FocusFeedState, INITIAL_STATE as FOCUS_FEED_INITIAL_STATE } from "@src/store/focus/feed";

describe('searchParams lib', () => {
	const timezone = "Europe/Madrid";
	const searchForm: FormSate = {
		query: "query",
		sort: "asc",
		period: "last_month",
		begin_date: null,
		end_date: null,
		limit: 20,
		start: 0,
		date_type: 'publication_date'
	};
	const searchFilters: FiltersState = {
		facetsGroups: { channel_type_id: [{ key: "facet1", name: "facetName" }] },
		feeds: ["feed-1"],
		focus: ["focus-1"]
	};

	const focusFeedState: FocusFeedState = {
		...FOCUS_FEED_INITIAL_STATE
	};

	it("searchPeriod tests", () => {
		const beginDate = new Date(0);
		const endDate = new Date(1);
		expect(getPeriodParams({ period: "last_month" }, timezone)).toEqual({ period: "last_month" });
		expect(getPeriodParams({ period: "custom", beginDate, endDate }, timezone)).toEqual({ begin_date: "1970-01-01T00:00:00+01:00", end_date: "1970-01-01T23:59:59+01:00" });
	});

	it("getInsertMentionSearchParams tests", () => {
		const beginDateStr = moment().subtract(6, 'month').startOf('day').tz(timezone).format();
		const endDateStr = moment().endOf('day').tz(timezone).format();
		expect(getInsertMentionSearchParams(timezone, "http://gironafc.cat")).toEqual({
			begin_date: beginDateStr,
			end_date: endDateStr,
			date_type: 'publication_date',
			insights_insert_url_search: 1,
			query: 'url:\"http://gironafc.cat\"',
			limit: 100,
			sort: "_doc:asc"
		});

		expect(getInsertMentionSearchParams(timezone, "http://gironafc.cat", "prov")).toEqual({
			begin_date: beginDateStr,
			end_date: endDateStr,
			date_type: 'publication_date',
			insights_insert_url_search: 1,
			query: 'url:\"http://gironafc.cat\" AND (channel_type_id: prov)',
			limit: 100,
			sort: "_doc:asc"
		});
	});

	it("getArticleSearchParams tests", () => {
		expect(getArticleSearchParams(searchForm, searchFilters, timezone)).toEqual({
			...searchForm,
			"insights.filter": "focus:focus-1,feed:feed-1",
			"channel_type_id_filter": "facet1",
			"begin_date": undefined,
			"end_date": undefined,
			"period": "last_month"
		});
	});

	it("getPreviewSearchParams tests", () => {
		expect(getPreviewSearchParams(focusFeedState, searchForm, searchFilters, timezone, "socialmedia")).toEqual({
			limit: searchForm.limit,
			start: searchForm.start,
			sort: searchForm.sort,
			filters: {
				channel_type_id: ["facet1"]
			},
			definition: {},
			begin_date: undefined,
			end_date: undefined,
			period: "last_month",
			type: "socialmedia"
		});
	});

	it("getArticleSearchFacetsParams tests", () => {
		expect(getArticleSearchFacetsParams(searchForm, searchFilters, timezone)).toEqual({
			...searchForm,
			"insights.filter": "focus:focus-1,feed:feed-1",
			"channel_type_id_filter": "facet1",
			"begin_date": undefined,
			"end_date": undefined,
			"period": "last_month",
			"facet_fields": "channel_type_id,topic_paths,language_id,country_path,tenants.categories_id,tenants.tags,media_id"
		});
	});

	it("getPreviewSearchFacetsParams tests", () => {
		expect(getPreviewSearchFacetsParams(focusFeedState, searchForm, searchFilters, timezone, "socialmedia")).toEqual({
			"limit": searchForm.limit,
			"insights.filter": "focus:focus-1,feed:feed-1",
			"channel_type_id_filter": "facet1",
			"definition": {},
			"begin_date": undefined,
			"end_date": undefined,
			"period": "last_month",
			"type": "socialmedia",
			"facet_fields": "channel_type_id,topic_paths,language.id,country_path"
		});
	});

	it("getPreviewSearchParams tests with cleaning social", () => {
		const focusFeedStateModified: FocusFeedState = {
			...focusFeedState,
			feedType: "socialmedia",
			social: {
				...focusFeedState.social,
				definition: {
					...focusFeedState.social.definition,
					main: {
						q: "kketa",
						enabled: true,
						scope: ["tags"]
					},
					include_expressions: [{ q: "", enabled: true, scope: ["tags"] }]
				}
			}
		};

		expect(getPreviewSearchParams(focusFeedStateModified, searchForm, searchFilters, timezone, "socialmedia")).toEqual({
			limit: searchForm.limit,
			start: searchForm.start,
			sort: searchForm.sort,
			filters: {
				channel_type_id: ["facet1"]
			},
			definition: {
				...focusFeedState.social.definition,
				main: {
					q: "kketa",
					enabled: true,
					scope: ["tags"]
				}
			},
			begin_date: undefined,
			end_date: undefined,
			period: "last_month",
			type: "socialmedia"
		});
	});
});
