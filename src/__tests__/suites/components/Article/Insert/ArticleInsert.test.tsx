import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import merge from "lodash/merge";
import last from 'lodash/last';

import ArticleInsert from "@src/components/Article/Insert/";
import { INITIAL_STATE } from "@src/store";
import { FeedObject } from "@src/class/Feed";
import { FocusFeeds, FocusObject } from "@src/class/Focus";
import ArticleInsertFormOnline from '@src/components/Article/Insert/Form/Online';
import ArticleInsertPrintForm from '@src/components/Article/Insert/Form/Print';
import ArticleInsertSocialForm from '@src/components/Article/Insert/Form/Social';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';
import { TenantObject } from "@src/class/Tenant";
import { InsertSocialForm } from "@src/types/article/insert";

const user = TestHelper.getUser();

const tenant: TenantObject = {
	id: 'rd-girona-test',
	guid: '00034972-0000-0000-0000-000000000000',
	name: 'rd.girona.test',
	tier_properties: {
		name: 'custom',
		results: {
			online: true,
			social: true
		}
	},
	print_only: false,
	facebook_linked_ids: [
		'157193954975917'
	],
	settings: {
		categorization_mode: 'no_flc',
		currency: 'USD',
		display_influencers: true,
		facebook_url: 'https://www.facebook.com/conjunt.chapo',
		valuation_metric: 'miv'
	}
};

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
	name: "feed-name-2"
};

const feedSocialEnabled: FeedObject = {
	...feedOnlineEnabled,
	id: "feed-id-3",
	name: "feed-name-3",
	type: "socialmedia"
};

const feedSocialDisabled: FeedObject = {
	...feedOnlineEnabled,
	enabled: false,
	id: "feed-id-4",
	name: "feed-name-4",
	type: "socialmedia"
};

const feedPrintOld: FeedObject = {
	...feedOnlineEnabled,
	id: "feed-id-5",
	name: "feed-name-5",
	type: "print"
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
	name: "focus-name-2"
};

const focusList: FocusObject[] = [focus, focus2];

const mockStore = configureMockStore();

function getWrappedComponent(component: JSX.Element, stateSlice: object) {
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	// Return also store to check actions executed
	return { store, component: mount(<Provider store={store}>{component}</Provider>) };
}

describe("<ArticleInsert>", () => {
	let wrapper: any;

	beforeEach(() => {
		wrapper = getWrappedComponent(<ArticleInsert />, {}).component;
	});

	it("Article Insert by default without focus list", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Article Insert by default with focus list", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } }
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('#insertDocumentDialogNextBtn.md-text--disabled')).toHaveLength(1);
	});

	it("Article Insert only with feed selected", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type }
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('#insertDocumentDialogNextBtn.md-text--disabled')).toHaveLength(1);
	});

	it("Article Insert only with invalid url", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					url: "badurl.bad.",
					invalidUrlError: "bad_error"
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('#insertDocumentDialogNextBtn.md-text--disabled')).toHaveLength(1);
		expect(component.find('label.md-text--error')).toHaveLength(1);
	});

	it("Article Insert only with valid url", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('#insertDocumentDialogNextBtn.md-text--disabled')).toHaveLength(1);
		expect(component.find('label.md-text--error')).toHaveLength(0);
	});

	it("Article Insert with selected feed and valid url", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		expect(component.find('#insertDocumentDialogNextBtn.md-text--disabled')).toHaveLength(0);
		expect(component.find('label.md-text--error')).toHaveLength(0);
	});

	it("Article Insert buttons in SELECT_FEED step", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } }
		});
		expect(component.html()).toMatchSnapshot();
	});

	it("Article Insert buttons in FILL_FORM step", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: { insert: { step: "FILL_FORM" } }
		});
		expect(component.html()).toMatchSnapshot();
	});

	it("Article Insert buttons in SELECT_FOUND_DOCUMENTS step", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: { insert: { step: "SELECT_FOUND_DOCUMENTS" } }
		});
		expect(component.html()).toMatchSnapshot();
	});

	it("Article Insert buttons with wrong step", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: { insert: { step: "WRONG_STEP" } }
		});
		expect(component.html()).toMatchSnapshot();
	});

	it("Article Insert on hide Dialog event", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } }
		});
		expect(component.html()).toMatchSnapshot();
		component.find('DialogContainer').at(0).props().onHide();
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/SET_SHOW_DIALOG', payload: { show: false } }]);
	});

	it("Article Insert cancel button click", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } }
		});
		expect(component.html()).toMatchSnapshot();
		component.find('#insertDocumentDialogCancelBtn').at(0).simulate('click');
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/SET_SHOW_DIALOG', payload: { show: false } }]);
	});

	it("Article Insert next button click", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: {
				insert: {
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.html()).toMatchSnapshot();
		component.find('#insertDocumentDialogNextBtn').at(0).simulate('click');
		component.update();
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/CHANGE_STEP', payload: { step: 'SELECT_FOUND_DOCUMENTS' }, meta: { api: 'start' } }]);
	});

	it("Article Insert back button click", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: { insert: { step: "SELECT_FOUND_DOCUMENTS" } }
		});
		expect(component.html()).toMatchSnapshot();
		component.find('#insertDocumentDialogBackBtn').at(0).simulate('click');
		expect(store.getActions()).toMatchObject([{ type: '@@article/insert/CHANGE_STEP', payload: { step: 'SELECT_FEED' } }]);
	});

	it("Article insert should not display any form", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedOnlineEnabled.id, type: 'bad_feed_type' },
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.find('.insert-document-dialog-content').html()).toMatchSnapshot();
	});

	it("Article Insert should display online form", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});

		expect(component.find(ArticleInsertFormOnline).exists()).toBe(true);
	});

	it("Article Insert should display print form", () => {
		const modifiedStore = {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: 1, type: 'print_percolator' },
					url: "http://gironafc.cat"
				}
			}
		};
		const { component } = getWrappedComponent(<ArticleInsert />, modifiedStore);
		expect(component.find(ArticleInsertPrintForm).exists()).toBe(true);
	});

	it("Accept documents on select_found_documents set state to insert_document", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			article: { insert: { step: "SELECT_FOUND_DOCUMENTS" } }
		});
		expect(component.html()).toMatchSnapshot();
		component.find('#insertDocumentDialogAcceptBtn').at(0).simulate('click');
		expect(store.getActions()).toMatchObject([{ meta: { api: 'start' }, type: '@@article/insert/CHANGE_STEP', payload: { step: 'INSERT_DOCUMENTS' } }]);
	});

	it("Accept button on online form set state to submit online document", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.find(ArticleInsertFormOnline).exists()).toBe(true);

		const unwrappedComponent = component.children().childAt(0);
		const unwrappedComponentInstance = unwrappedComponent.instance() as any;
		unwrappedComponentInstance._handleValidationError = jest.fn();

		component.find('#insertDocumentDialogAcceptBtn').at(0).simulate('click');
		expect(unwrappedComponent.state('formSubmitted')).toEqual(true);
	});

	it("Accept button on print form set state to submit print document", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: 1, type: 'print_percolator' },
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.find(ArticleInsertPrintForm).exists()).toBe(true);

		const unwrappedComponent = component.children().childAt(0);
		(unwrappedComponent.instance() as any)._handleValidationError = jest.fn();

		component.find('#insertDocumentDialogAcceptBtn').at(0).simulate('click');
		expect(unwrappedComponent.state('formSubmitted')).toEqual(true);
	});

	it("Accept button error validation test", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.find(ArticleInsertFormOnline).exists()).toBe(true);

		const unwrappedComponent = component.children().childAt(0);
		unwrappedComponent.setState({ formSubmitted: true });
		expect(unwrappedComponent.state('formSubmitted')).toEqual(false);
	});

	it("Accept button on accept button no feed", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			article: {
				insert: {
					step: "FILL_FORM",
					url: "http://gironafc.cat"
				}
			}
		});

		const unwrappedComponent = component.children().childAt(0);
		component.find('#insertDocumentDialogAcceptBtn').at(0).simulate('click');
		expect(unwrappedComponent.state('formSubmitted')).toEqual(false);
	});

	it("Accept button on accept button wrong feed type", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: 1, type: 'print' },
					url: "http://gironafc.cat"
				}
			}
		});

		const unwrappedComponent = component.children().childAt(0);
		component.find('#insertDocumentDialogAcceptBtn').at(0).simulate('click');
		expect(unwrappedComponent.state('formSubmitted')).toEqual(false);
	});

	it("Accept button empty case", () => {
		const onChangeStep = jest.fn();
		const { component } = getWrappedComponent(<ArticleInsert />, {
			focus: { list: { focusList } },
			article: { insert: { step: "WRONG_STEP" } }
		});
		component.setProps({ onChangeStep });
		const unwrappedComponent = component.children().childAt(0);
		const unwrappedComponentInstance = unwrappedComponent.instance() as any;
		unwrappedComponentInstance._handleSubmit();
		expect(unwrappedComponent.state('formSubmitted')).toEqual(false);
		expect(onChangeStep).toHaveBeenCalledTimes(0);
	});

	it("Submit online should set create_document step", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedOnlineEnabled.id, type: feedOnlineEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		const onlineForm = {
			title: 'test',
			content: 'test',
			country: 'ES',
			date: '2019-08-12',
			language: 'es',
			media_id: '1234',
			media_url: 'url',
			media_name: 'name',
			miv: 1,
			similarweb_monthly_visits: 2000,
			tags: new Set<string>(),
			category: '00110011'
		};
		expect(component.find(ArticleInsertFormOnline).exists()).toBe(true);

		component.find(ArticleInsertFormOnline).at(0).props().onValidationSuccess(onlineForm);
		expect(last(store.getActions())).toMatchObject({ meta: { api: 'start' }, type: '@@article/insert/CHANGE_STEP', payload: { step: 'CREATE_DOCUMENT', form: onlineForm } });
	});

	it("Submit print should set create_document step", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedOnlineEnabled.id, type: 'print_percolator' },
					url: "http://gironafc.cat"
				}
			}
		});
		const printForm = {
			title: 'test',
			country: 'ES',
			date: '2019-08-12',
			media_name: 'name',
			miv: 1,
			image: new File(['file'], 'test'),
			tags: new Set<string>(),
			category: '00110011'
		};
		expect(component.find(ArticleInsertPrintForm).exists()).toBe(true);

		component.find(ArticleInsertPrintForm).at(0).props().onValidationSuccess(printForm);
		expect(last(store.getActions())).toMatchObject({ meta: { api: 'start' }, type: '@@article/insert/CHANGE_STEP', payload: { step: 'CREATE_DOCUMENT', form: printForm } });
	});

	it("Submit social should set create_document step", () => {
		const { component, store } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedOnlineEnabled.id, type: 'socialmedia' },
					url: "https://www.instagram.com/p/B4H3CguiBtY/"
				}
			}
		});
		const socialForm: InsertSocialForm = {
			title: 'test',
			country: 'ES',
			date: '2019-08-12',
			image: new File(['file'], 'test'),
			tags: new Set<string>(),
			category: '00110011',
			profile_url: "https://www.instagram.com/p/B4H3CguiBtY/",
			followers: 10,
			likes: 5,
			shares: 20,
			language: "es"
		};
		expect(component.find(ArticleInsertSocialForm).exists()).toBe(true);

		component.find(ArticleInsertSocialForm).at(0).props().onValidationSuccess(socialForm);
		expect(last(store.getActions())).toMatchObject({ meta: { api: 'start' }, type: '@@article/insert/CHANGE_STEP', payload: { step: 'CREATE_DOCUMENT', form: socialForm } });
	});

	it("Accept button on social form set state to submit social document", () => {
		const { component } = getWrappedComponent(<ArticleInsert />, {
			app: {
				profile: {
					user,
					tenant
				}
			},
			focus: { list: { focusList } },
			article: {
				insert: {
					step: "FILL_FORM",
					selectedFeed: { id: feedSocialEnabled.id, type: feedSocialEnabled.type },
					url: "http://gironafc.cat"
				}
			}
		});
		expect(component.find(ArticleInsertSocialForm).exists()).toBe(true);

		const unwrappedComponent = component.children().childAt(0);
		const unwrappedComponentInstance = unwrappedComponent.instance() as any;
		unwrappedComponentInstance._handleValidationError = jest.fn();

		component.find('#insertDocumentDialogAcceptBtn').at(0).simulate('click');
		expect(unwrappedComponent.state('formSubmitted')).toEqual(true);
	});
});
