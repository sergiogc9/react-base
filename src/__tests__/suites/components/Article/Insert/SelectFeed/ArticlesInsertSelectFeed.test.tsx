import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import merge from "lodash/merge";

import ArticleSelectFeed from "@src/components/Article/Insert/SelectFeed";
import { INITIAL_STATE } from "@src/store";
import { FeedObject } from "@src/class/Feed";
import { FocusFeeds, FocusObject } from "@src/class/Focus";
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const document = TestHelper.getDocument();

const feedOnlineEnabled: FeedObject = {
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

const feedOnlineDisabled: FeedObject = {
	...feedOnlineEnabled,
	enabled: false,
	id: "feed-id-2",
	name: "feed-name-2",
};

const feedSocialEnabled: FeedObject = {
	...feedOnlineEnabled,
	id: "feed-id-3",
	name: "feed-name-3",
	type: "socialmedia",
};

const feedSocialDisabled: FeedObject = {
	...feedOnlineEnabled,
	enabled: false,
	id: "feed-id-4",
	name: "feed-name-4",
	type: "socialmedia",
};

const feedPrintOld: FeedObject = {
	...feedOnlineEnabled,
	id: "feed-id-5",
	name: "feed-name-5",
	type: "print",
};

const feedPrintNew: FeedObject = {
	...feedOnlineEnabled,
	enabled: false,
	id: "feed-id-6",
	name: "feed-name-6",
	type: "print_percolator"
};

const focusFeeds: FocusFeeds = {
	online: [feedOnlineEnabled, feedOnlineDisabled],
	socialmedia: [feedSocialEnabled, feedSocialDisabled],
	print: [feedPrintOld, feedPrintOld]
};

const focus: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: focusFeeds,
	id: "focus-id-1",
	inserted_at: new Date(1549287550563),
	name: "focus-name-1",
	oldest_document: document,
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url.com",
	acl_users: [
		{
			user_id: 'fake-user-id-1',
			discover_role: 'viewer',
			last_name: "Name",
			first_name: "User"
		},
		{
			user_id: 'fake-user-id-2',
			discover_role: 'viewer',
			last_name: 'User 2',
			first_name: 'Name 2'
		}
	]
};

const focus2: FocusObject = {
	...focus,
	feeds: { online: [], socialmedia: [], print: [] },
	id: "focus-id-2",
	name: "focus-name-2",
};

const focus3: FocusObject = {
	...focus,
	feeds: undefined,
	id: "focus-id-2",
	name: "focus-name-2",
};

const focusList: FocusObject[] = [focus, focus2, focus3];

const mockStore = configureMockStore();

function getWrappedComponent(component: JSX.Element, stateSlice: object) {
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	// Return also store to check actions executed
	return { store, component: mount(<Provider store={store}>{component}</Provider>) };
}

describe("<ArticleSelectFeed>", () => {
	let wrapper: any;

	beforeEach(() => {
		wrapper = getWrappedComponent(<ArticleSelectFeed />, {}).component;
	});

	it("Component by default", () => {
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('CircularProgress#insertDocumentDialogLoading')).toHaveLength(0);
	});

	it("Component by default with loading", () => {
		const { component } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: { insert: { loading: true } }
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('CircularProgress#insertDocumentDialogLoading')).toHaveLength(1);
	});

	it("Component by default with focus list", () => {
		const { component } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } }
		});
		expect(component.html()).toMatchSnapshot();
	});

	it("Component only with feed selected", () => {
		const { component } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type }
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('input#insertDocumentDialogUrlInput')).toHaveLength(1);
	});

	it("Component only with print feed selected", () => {
		const { component } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedPrintNew.id, type: feedPrintNew.type }
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('input#insertDocumentDialogUrlInput')).toHaveLength(0);
	});

	it("Component only with invalid url", () => {
		const { component } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					url: "badurl.bad.",
					invalidUrlError: "bad_error"
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('label.md-text--error')).toHaveLength(1);
	});

	it("Select feed selected handler", () => {
		const { component, store } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type }
				}
			}
		});
		component.find('SelectField#insertDocumentDialogSelectFeed').at(0).props().onChange(feedPrintNew.id);
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/SET_SELECTED_FEED_ID', payload: { id: feedPrintNew.id } }]);
	});

	it("Select feed on blur url input", () => {
		const { component, store } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					url: "gironafc.cat"
				}
			}
		});
		component.find('TextField#insertDocumentDialogUrlInput input').at(0).simulate('blur');
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/CHECK_URL', payload: {} }]);
	});

	it("Url text field change handler", () => {
		const { component, store } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type }
				}
			}
		});
		component.find('TextField#insertDocumentDialogUrlInput').at(0).props().onChange("http://gironafc.cat");
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/SET_URL', payload: { url: "http://gironafc.cat" } }]);
	});

	it("Url text field key down handler when next button is disabled", () => {
		const { component, store } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type }
				}
			}
		});
		component.find('TextField#insertDocumentDialogUrlInput').at(0).props().onKeyDown({ keyCode: 13 });
		expect(store.getActions()).toMatchObject([]);
	});

	it("Url text field key down handler with another key but enter", () => {
		const { component, store } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		component.find('TextField#insertDocumentDialogUrlInput').at(0).props().onKeyDown({ keyCode: 2 });
		expect(store.getActions()).toMatchObject([]);
	});

	it("Url text field key down handler with enter key", () => {
		const { component, store } = getWrappedComponent(<ArticleSelectFeed />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		component.find('TextField#insertDocumentDialogUrlInput').at(0).props().onKeyDown({ keyCode: 13 });
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/CHANGE_STEP', payload: { step: 'SELECT_FOUND_DOCUMENTS' }, meta: { api: 'start' } }]);
	});
});
