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
});
