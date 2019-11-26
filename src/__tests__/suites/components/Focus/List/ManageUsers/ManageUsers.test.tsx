import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import CircularProgress from "react-md/lib/Progress/CircularProgress";
import SelectionControl from "react-md/lib/SelectionControls/SelectionControl";
import merge from "lodash/merge";

import { INITIAL_STATE } from "@src/store";
import { FocusObject, FocusFeeds } from "@src/class/Focus";
import { TenantObject, TenantUser } from "@src/class/Tenant";
import FocusListManageUsers from "@src/components/Focus/List/ManageUsers";
import TestHelper from '@src/__tests__/utils/Helper/TestHelper';

const mockStore = configureMockStore();

function getWrappedComponent(component: JSX.Element, stateSlice: object) {
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	return mount(<Provider store={store}>{component}</Provider>);
}

const document = TestHelper.getDocument();

const user1: TenantUser = {
	id: "fake-user-id-1",
	email: "fake@mail.com",
	first_name: "Fake",
	last_name: "Name",
	inserted_at: new Date(),
	updated_at: new Date(),
	role: "viewer"
};

const user2: TenantUser = {
	...user1,
	id: "fake-user-id-2",
	role: "clipper"
};

const tenantUsers: TenantUser[] = [user1, user2];

const focus: FocusObject = {
	deleted_at: new Date(1549287550563),
	feeds: { online: [], socialmedia: [], print: [] },
	id: "focus-id-1",
	inserted_at: new Date(1549287550563),
	name: "focus-name-1",
	oldest_document: document,
	updated_at: new Date(1549287550563),
	url_logo: "http://fake-url.com",
	acl_users: [
		{
			user_id: user1.id,
			discover_role: user1.role,
			last_name: user1.last_name,
			first_name: user1.first_name
		}
	]
};

const focus2: FocusObject = {
	...focus,
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
	},
	users: tenantUsers
};

let onCloseMock: jest.Mock;

describe("FocusList", () => {
	let wrapper: any;

	beforeEach(() => {
		onCloseMock = jest.fn();
		wrapper = getWrappedComponent(<FocusListManageUsers
			focusId={focus.id}
			onClose={onCloseMock} />,
		{
			app: { profile: { tenant } },
			focus: {
				list: {
					focusList
				}
			}
		});
	});

	it("Manage focus users snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Manage focus users loading snapshot", () => {
		const component = getWrappedComponent(<FocusListManageUsers
			focusId={focus.id}
			onClose={onCloseMock} />,
		{
			app: { profile: { tenant } },
			focus: {
				list: {
					focusList,
					manageFocusLoadingUsers: [user1.id]
				}
			}
		});

		expect(component.html()).toMatchSnapshot();
		expect(component.find(CircularProgress)).toHaveLength(1);
	});

	it("Manage focus users toggle user status", () => {
		const component = getWrappedComponent(<FocusListManageUsers
			focusId={focus.id}
			onClose={onCloseMock} />,
		{
			app: { profile: { tenant: { ...tenant, users: [user1] } } },
			focus: {
				list: {
					focusList
				}
			}
		});

		component.find(SelectionControl).at(0).props().onChange(false);
		expect(component.find('div.md-switch-track--off')).toHaveLength(0);
	});

	it("Manage focus users close dialog", () => {
		wrapper.find(`button#launchmetricsDialogAcceptBtn`).simulate('click');
		expect(onCloseMock).toHaveBeenCalledTimes(1);
	});
});
