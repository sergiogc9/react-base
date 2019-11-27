import { setWrongPath } from '@src/lib/sagas';

describe('lib sagas setWrongPath', () => {

	let trackPage = jest.fn();

	beforeEach(() => {
		trackPage = jest.fn();
		GA.trackPage = trackPage;
	});

	it("setWrongPath called without message and redirect", () => {
		const generator = setWrongPath({});
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { notification: { level: "warning", t: "error.page_not_found" } } } } });
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { args: ["/"] } } } });
		expect(generator.next().value).toBe(undefined);
		expect(trackPage).toBeCalledTimes(1);
		expect(trackPage).toHaveBeenCalledWith("/wrongpath");
	});

	it("setWrongPath called with message and wihtout redirect", () => {
		const generator = setWrongPath({ message: "some message" });
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { notification: { level: "warning", text: "some message" } } } } });
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { args: ["/"] } } } });
		expect(generator.next().value).toBe(undefined);
		expect(trackPage).toBeCalledTimes(1);
		expect(trackPage).toHaveBeenCalledWith("/wrongpath");
	});

	it("setWrongPath called with redirect and wihtout message", () => {
		const generator = setWrongPath({ redirectTo: "/somePath/" });
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { notification: { level: "warning", t: "error.page_not_found" } } } } });
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { args: ["/somePath/"] } } } });
		expect(generator.next().value).toBe(undefined);
		expect(trackPage).toBeCalledTimes(1);
		expect(trackPage).toHaveBeenCalledWith("/wrongpath");
	});

	it("setWrongPath called with redirect and message", () => {
		const generator = setWrongPath({ redirectTo: "/somePath/", message: "some message" });
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { notification: { level: "warning", text: "some message" } } } } });
		expect(generator.next().value).toMatchObject({ payload: { action: { payload: { args: ["/somePath/"] } } } });
		expect(generator.next().value).toBe(undefined);
		expect(trackPage).toBeCalledTimes(1);
		expect(trackPage).toHaveBeenCalledWith("/wrongpath");
	});

});
