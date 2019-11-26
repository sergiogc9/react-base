export class UserObject {
	public id: string;
	public name: string;

	constructor(values?: Partial<UserObject>) {
		if (values) Object.assign(this, values);
	}
}

export class User extends UserObject {

}
