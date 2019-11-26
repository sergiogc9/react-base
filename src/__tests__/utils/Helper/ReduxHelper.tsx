import React from 'react';
import configureMockStore from "redux-mock-store";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import merge from "lodash/merge";

import { INITIAL_STATE } from "@src/store";

const getWrappedComponent = (component: JSX.Element, stateSlice: object) => {
	const mockStore = configureMockStore();
	const store = mockStore(merge({}, INITIAL_STATE, stateSlice));
	// Return also store to check actions executed
	return {
		store,
		component: mount(<Provider store={store}>{component}</Provider>)
	};
};

export default { getWrappedComponent };
