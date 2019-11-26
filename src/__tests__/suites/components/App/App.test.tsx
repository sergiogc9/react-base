import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import merge from "lodash/merge";
import configureMockStore from "redux-mock-store";

import { ProfileObject } from "@src/class/Profile";
import App from "@src/components/App/App";
import AppWithStore from "@src/components/App";
import { INITIAL_STATE } from "@src/store";

const mockStore = configureMockStore();

const profile: ProfileObject = {
	user: {
		id: "40BF1356-4E09-4065-8913-CFECDB7387A5",
		name: "Sergi Massaneda",
		role: "sysadmin",
		permissions: [
			"tenant_settings.edit",
			"feed.print.manage",
			"search.unrestricted_period",
			"feed.save.apply_to_past_results",
			"switch_tenant",
			"admin_access",
			"facebook_visible"
		],
		facebook_linked_ids: [
			"157193954975917"
		],
		settings: {
			language_code: "en",
			locale: "en-GB",
			results_page_size: 20,
			timezone: "UTC"
		}
	},
	tenant: {
		id: "rd-girona-test",
		guid: "00034972-0000-0000-0000-000000000000",
		name: "rd.girona.test",
		tier_properties: {
			name: "diamond",
			limit: 50000,
			results: {
				online: true,
				social: true
			}
		},
		print_only: false,
		facebook_linked_ids: [
			"157193954975917"
		],
		settings: {
			categorization_mode: "no_flc",
			currency: "USD",
			display_influencers: true,
			facebook_url: "https://www.facebook.com/conjunt.chapo",
			valuation_metric: "miv"
		}
	}
};

const onAuthMock = jest.fn();

function getWrappedComponent(component: JSX.Element, stateSlice: object) {
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	return mount(<Provider store={store}>{component}</Provider>);
}

describe("App", () => {

	beforeAll(() => {
		Object.defineProperty(window, "matchMedia", {
			value: jest.fn(() => ({ matches: true }))
		});
	});

	it("Not authenticated shows loader", () => {
		const wrapper = shallow(<App
			authenticated={false}
			tenant={null}
			onAuth={onAuthMock}
		/>);
		expect(onAuthMock).toHaveBeenCalled();
		expect(wrapper).toMatchSnapshot();
	});

	it("Authenticated shows routes", () => {
		const wrapper = shallow(<App
			authenticated={false}
			tenant={null}
			onAuth={onAuthMock}
		/>);
		expect(onAuthMock).toHaveBeenCalled();
		wrapper.setProps({ authenticated: true, user: profile.user, tenant: profile.tenant });
		expect(wrapper).toMatchSnapshot();
	});

	it("User with newsletter permissions sees newsletter tab", () => {
		const userWithPermissions = { ...profile.user, permissions: [...profile.user.permissions, "newsletter.list"] };
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/article']}>
			<AppWithStore onAuth={onAuthMock} />
		</MemoryRouter>, { app: { auth: { authenticated: true }, profile: { tenant: profile.tenant, user: userWithPermissions } } });
		expect(wrapper.find('Tab[label="tabs.newsletters"]')).toHaveLength(1);
	});

	it("User without newsletter permissions does not see newsletter tab", () => {
		const userWithoutPermissions = { ...profile.user, permissions: [] };
		const wrapper = getWrappedComponent(<MemoryRouter initialEntries={['/article']}>
			<AppWithStore onAuth={onAuthMock} />
		</MemoryRouter>, { app: { auth: { authenticated: true }, profile: { tenant: profile.tenant, user: userWithoutPermissions } } });
		expect(wrapper.find('Tab[label="tabs.newsletters"]')).toHaveLength(0);
	});
});
