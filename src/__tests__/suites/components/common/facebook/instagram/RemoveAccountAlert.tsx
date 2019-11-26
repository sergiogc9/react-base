import { shallow } from 'enzyme';
import React from 'react';

import RemoveAccountAlert from '@src/components/common/facebook/instagram/RemoveAccountAlert';

let onAcceptMock: jest.Mock;
let onCancelMock: jest.Mock;

describe('<RemoveInstagramAccountAlert />', () => {
	let wrapper: any;

	beforeEach(() => {
		onAcceptMock = jest.fn();
		onCancelMock = jest.fn();
		wrapper = shallow((<RemoveAccountAlert
			onAccept={onAcceptMock}
			onCancel={onCancelMock}
		></RemoveAccountAlert>));
	});

	it("Test RemoveAccountAlert component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});
});
