import { UserObject } from '@src/class/User';

const user: UserObject = {
	id: 'fake-id',
	name: 'Fake name'
};

export default {
	getUser: () => user
};
