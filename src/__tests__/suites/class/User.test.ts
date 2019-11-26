import { User } from '@src/class/User';
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const userData = TestHelper.getUser();

describe('user class', () => {

	it('should create a new empty user', () => {
		const t = new User();
		expect(t.id).toBeUndefined();
	});

	it('should create a new User with id', () => {
		const t = new User({ id: userData.id });
		expect(t.id).toEqual(userData.id);
	});

	it('should create a new User with all data', () => {
		const t = new User(userData);
		expect(t).toMatchObject(userData);
	});

	it('should create a new User and call hasPermission', () => {
		const t = new User(userData);
		expect(t.hasPermission('search.unrestricted_period')).toBeFalsy();
		expect(t.hasPermission('switch_tenant')).toBeTruthy();
	});

	it('should mark it as internalUser with launchmetrics mail', () => {
		const t = new User(userData);
		expect(t.isInternal()).toBeTruthy();
	});

	it('should mark it as non internalUser without launchmetrics mail', () => {
		const t = new User({ email: 'sergi.cabezon@gmail.com' });
		expect(t.isInternal()).toBeFalsy();
	});

});
