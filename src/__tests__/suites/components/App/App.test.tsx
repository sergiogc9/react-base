import React from "react";
import { shallow } from "enzyme";

import App from "@src/components/App/App";

const onAuthMock = jest.fn();

describe("App", () => {

	beforeAll(() => {
		Object.defineProperty(window, "matchMedia", {
			value: jest.fn(() => ({ matches: true }))
		});
	});

	it("Not authenticated shows loader", () => {
		const wrapper = shallow(<App
			authenticated={false}
			onAuth={onAuthMock}
		/>);
		expect(onAuthMock).toHaveBeenCalled();
		expect(wrapper).toMatchSnapshot();
	});

	it("Authenticated shows routes", () => {
		const wrapper = shallow(<App
			authenticated={false}
			onAuth={onAuthMock}
		/>);
		expect(onAuthMock).toHaveBeenCalled();
		wrapper.setProps({ authenticated: true });
		expect(wrapper).toMatchSnapshot();
	});
});
