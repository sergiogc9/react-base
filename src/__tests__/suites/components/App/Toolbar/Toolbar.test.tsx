import { shallow } from 'enzyme';
import React from 'react';

import { TenantObject } from '@src/class/Tenant';
import { UserObject } from '@src/class/User';
import Toolbar from '@src/components/App/Toolbar/Toolbar';
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

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

const user = TestHelper.getUser();

const userWithoutPermissions: UserObject = {
	...user,
	permissions: []
};

describe('<Toolbar />', () => {
	let wrapper: any;

	beforeEach(() => {
		wrapper = shallow((<Toolbar
			user={user}
			tenant={tenant}
		></Toolbar>));
		jest.useFakeTimers();
	});

	it("Test Toolbar component snapshot with permissions", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Test Toolbar component snapshot without permissions", () => {
		wrapper.setProps({ user: userWithoutPermissions });
		expect(wrapper.html()).toMatchSnapshot();
	});
});
