import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureMockStore from "redux-mock-store";
import CircularProgress from "react-md/lib/Progress/CircularProgress";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import { routerActions } from 'connected-react-router';

import FocusList from "@src/components/Focus/List";
import server from '@src/lib/ajax/server';
import { INITIAL_STATE } from "@src/store";
import { FocusObject, FocusFeeds } from "@src/class/Focus";
import { FeedObject } from "@src/class/Feed";
import { TenantObject } from "@src/class/Tenant";
import { UserObject } from "@src/class/User";
import FocusListDialog from "@src/components/Focus/List/Dialog/FocusListDialog";
import ManageUsers from "@src/components/Focus/List/ManageUsers/ManageUsers";
import GA from '@src/lib/googleAnalytics';
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const mockStore = configureMockStore();

function getWrappedComponent(component: JSX.Element, stateSlice: object) {
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	return mount(<Provider store={store}><MemoryRouter>{component}</MemoryRouter></Provider>);
}

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
	enabled: false,
	id: "feed-id-2",
	name: "feed-name-2"
};

const feed3: FeedObject = {
	...feed,
	id: "feed-id-3",
	name: "feed-name-3",
	type: "socialmedia"
};

const feed4: FeedObject = {
	...feed,
	enabled: false,
	id: "feed-id-4",
	name: "feed-name-4",
	type: "socialmedia"
};

const feed5: FeedObject = {
	...feed,
	id: "feed-id-5",
	name: "feed-name-5",
	type: "print"
};

const feed6: FeedObject = {
	...feed,
	enabled: false,
	id: "feed-id-6",
	name: "feed-name-6",
	type: "print_percolator"
};

const focusFeeds: FocusFeeds = {
	online: [feed, feed2],
	socialmedia: [feed3, feed4],
	print: [feed5, feed6]
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

// TODO: Use user from test helper
const user: UserObject = {
	id: '40BF1356-4E09-4065-8913-CFECDB7387A5',
	name: 'Sergi Massaneda',
	role: 'sysadmin',
	permissions: [
		'tenant_settings.edit',
		'feed.print.manage',
		'feed.save.apply_to_past_results',
		'switch_tenant',
		'admin_access',
		'facebook_visible',
		'focus.view',
		'focus.manage_acl',
		'feed.definition.edit',
		'feed.delete'
	],
	facebook_linked_ids: [
		'10160315799795215'
	],
	settings: {
		language_code: 'en',
		locale: 'en-GB',
		results_page_size: 20,
		timezone: 'UTC'
	}
};

const redirectAsyncMock = jest.fn();
server.redirectAsync = redirectAsyncMock;

describe("FocusList", () => {
	let wrapper: any;

	beforeAll(() => {
		Object.defineProperty(window.location, 'assign', {
			configurable: true
		});
		window.location.assign = jest.fn();
	});

	beforeEach(() => {
		wrapper = getWrappedComponent(<FocusList />, {
			app: { profile: { user, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});
	});

	it("Null focus list snapshot", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user, tenant } },
			focus: {
				list: {
					focusList: null
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
	});

	it("Empty focus list snapshot", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user, tenant } },
			focus: {
				list: {
					focusList: []
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
	});

	it("Focus list snapshot", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
	});

	it("Focus list loading snapshot", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user, tenant } },
			focus: {
				list: {
					focusList: null,
					loading: true
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
		expect(component.find(CircularProgress)).toHaveLength(1);
	});

	it("Focus list user without print permissions snapshot", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [] }, tenant } },
			focus: {
				list: {
					focusList: null,
					loading: true
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
	});

	it("Focus list should not show options if user has not permissions", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find('Button#focusListCreateFocusBtn')).toHaveLength(0);
		expect(component.find(`td.focus-list-options button`)).toHaveLength(0);
	});

	it("Focus list should only show manage users options if user has not other permissions", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: ['focus.manage_acl'] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find('Button#focusListCreateFocusBtn')).toHaveLength(0);
		component.find('td.focus-list-options button').at(0).simulate('click');
		expect(component.find(`td.focus-list-options div#focusListRenameFocusOption${focus.id}`)).toHaveLength(0);
		expect(component.find(`td.focus-list-options div#focusListManageUsersInFocus${focus.id}`)).toHaveLength(1);
		expect(component.find(`td.focus-list-options div#focusListCreateOnlineFeedOption${focus.id}`)).toHaveLength(0);
		expect(component.find(`td.focus-list-options div#focusListCreateSocialFeedOption${focus.id}`)).toHaveLength(0);
		expect(component.find(`td.focus-list-options div#focusListCreatePrintFeedOption${focus.id}`)).toHaveLength(0);
		expect(component.find(`td.focus-list-options div#focusListRemoveFocusOption${focus.id}`)).toHaveLength(0);
	});

	it("Focus list should show create focus dialog and close it", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [...user.permissions, "focus.create"] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find(FocusListDialog)).toHaveLength(0);
		component.find('Button#focusListCreateFocusBtn').simulate('click');
		expect(component.find(FocusListDialog)).toHaveLength(1);
		component.find('Button#launchmetricsDialogCancelBtn').simulate('click');
		expect(component.find(FocusListDialog)).toHaveLength(0);
	});

	it("Focus list should show rename focus dialog and close it", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [...user.permissions, 'focus.rename'] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find(FocusListDialog)).toHaveLength(0);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListRenameFocusOption${focus.id}`).simulate('click');
		expect(component.find(FocusListDialog)).toHaveLength(1);
		component.find('Button#launchmetricsDialogCancelBtn').simulate('click');
		expect(component.find(FocusListDialog)).toHaveLength(0);
	});

	it("Focus list should show manage focus users dialog and close it", () => {
		expect(wrapper.find(ManageUsers)).toHaveLength(0);
		wrapper.find('td.focus-list-options button').at(0).simulate('click');
		wrapper.find(`td.focus-list-options div#focusListManageUsersInFocus${focus.id}`).simulate('click');
		expect(wrapper.find(ManageUsers)).toHaveLength(1);
		wrapper.find('Button#launchmetricsDialogAcceptBtn').simulate('click');
		expect(wrapper.find(ManageUsers)).toHaveLength(0);
	});

	it("Focus list should show remove focus dialog and close it", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [...user.permissions, 'focus.delete'] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find(FocusListDialog)).toHaveLength(0);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListRemoveFocusOption${focus.id}`).simulate('click');
		expect(component.find(FocusListDialog)).toHaveLength(1);
		component.find('Button#launchmetricsDialogCancelBtn').simulate('click');
		expect(component.find(FocusListDialog)).toHaveLength(0);
	});

	it("Focus list should call to redirect to create new online, social or print feed page", () => {
		const spy = jest.spyOn(routerActions, "push");

		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [...user.permissions, 'feed.create'] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(redirectAsyncMock).toHaveBeenCalledTimes(0);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListCreateOnlineFeedOption${focus.id}`).simulate('click');
		expect(redirectAsyncMock).toHaveBeenCalledTimes(1);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListCreatePrintFeedOption${focus.id}`).simulate('click');
		expect(redirectAsyncMock).toHaveBeenCalledTimes(2);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListCreateSocialFeedOption${focus.id}`).simulate('click');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it("Focus list with tenant with only print permissions", () => {
		const tenantOnlyPrint: TenantObject = { ...tenant, print_only: true };
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [...user.permissions, 'feed.create'] }, tenant: tenantOnlyPrint } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find('#focusListLimitationDialog')).toHaveLength(0);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListCreateOnlineFeedOption${focus.id}`).simulate('click');
		expect(component.find('div#focusListLimitationDialog')).toHaveLength(1);
		component.find(`button#launchmetricsDialogAcceptBtn`).simulate('click');
		expect(component.find('#focusListLimitationDialog')).toHaveLength(0);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListCreateSocialFeedOption${focus.id}`).simulate('click');
		expect(component.find('div#focusListLimitationDialog')).toHaveLength(1);
	});

	it("Focus list with tenant without create social focus permissions", () => {
		const tenantWithoutSocialFocus: TenantObject = { ...tenant };
		tenantWithoutSocialFocus.tier_properties.results.social = false;
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [...user.permissions, 'feed.create'] }, tenant: tenantWithoutSocialFocus } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find('#focusListLimitationDialog')).toHaveLength(0);
		component.find('td.focus-list-options button').at(0).simulate('click');
		component.find(`td.focus-list-options div#focusListCreateSocialFeedOption${focus.id}`).simulate('click');
		expect(component.find('div#focusListLimitationDialog')).toHaveLength(1);
		component.find(`button#launchmetricsDialogAcceptBtn`).simulate('click');
		expect(component.find('#focusListLimitationDialog')).toHaveLength(0);
	});

	it("Focus list without manage users permisions", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
	});

	it("Focus list without manage users permisions but with feed print manage permission", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: ['feed.print.manage'] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
	});

	it("Focus list without manage permisions should not show create focus button", () => {
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user: { ...user, permissions: [] }, tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});

		expect(component.find('#focusListCreateFocusBtn')).toHaveLength(0);
	});

	it("Focus list without focus users", () => {
		const focusListWithoutUsers = cloneDeep(focusList);
		focusListWithoutUsers[0].acl_users = [];
		const component = getWrappedComponent(<FocusList />, {
			app: { profile: { user, tenant } },
			focus: {
				list: {
					focusList: focusListWithoutUsers
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
	});

	it("GA event tracker", () => {

		let trackEvent = jest.fn();
		GA.trackEvent = trackEvent;
		expect(trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('td.focus-list-content div a').at(0).simulate('click');
		expect(trackEvent).toHaveBeenCalledTimes(1);

		trackEvent = jest.fn();
		GA.trackEvent = trackEvent;
		expect(trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('td.focus-list-content div.online-feed button').at(0).simulate('click');
		expect(trackEvent).toHaveBeenCalledTimes(1);
		wrapper.find(`a#focusListFeedEditDefinition${feed.id}`).simulate('click');
		expect(trackEvent).toHaveBeenCalledTimes(2);
		wrapper.find(`a#focusListFeedViewDocuments${feed.id}`).simulate('click');
		expect(trackEvent).toHaveBeenCalledTimes(3);

		trackEvent = jest.fn();
		GA.trackEvent = trackEvent;
		expect(trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('td.focus-list-content div.social-feed button').at(0).simulate('click');
		expect(trackEvent).toHaveBeenCalledTimes(1);

		trackEvent = jest.fn();
		GA.trackEvent = trackEvent;
		expect(trackEvent).toHaveBeenCalledTimes(0);
		wrapper.find('td.focus-list-content div.print-feed a').at(0).simulate('click');
		expect(trackEvent).toHaveBeenCalledTimes(1);
	});

	it("Focus list feed menu remove feed click ", () => {
		expect(wrapper.find(FocusListDialog)).toHaveLength(0);
		wrapper.find('td.focus-list-content div.social-feed button').at(0).simulate('click');
		wrapper.find(`div#focusListFeedRemove${feed3.id}`).simulate('click');
		expect(wrapper.find(FocusListDialog)).toHaveLength(1);
	});
});
