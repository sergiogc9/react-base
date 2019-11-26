import { UserObject } from '@src/class/User';

const user: UserObject = {
	id: '40BF1356-4E09-4065-8913-CFECDB7387A5',
	name: 'Sergi Massaneda',
	email: 'trosdecapgros@launchmetrics.com',
	role: 'sysadmin',
	permissions: [
		'tenant_settings.edit',
		'feed.print.manage',
		'feed.save.apply_to_past_results',
		'switch_tenant',
		'admin_access',
		'facebook_visible'
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

export default {
	getUser: () => user
};
