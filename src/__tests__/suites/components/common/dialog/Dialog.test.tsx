import { mount } from 'enzyme';
import React from 'react';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';

import Dialog from '@src/components/common/dialog';

let onAcceptMock: jest.Mock;
let onCancelMock: jest.Mock;

describe('<Dialog />', () => {
	let wrapper: any;

	beforeEach(() => {
		onAcceptMock = jest.fn();
		onCancelMock = jest.fn();
		wrapper = mount((<Dialog
			id="dialog-id"
			title="Dialog title"
			content={(<div id="dialog-content"></div>)}
			icon={<FontIcon>warning</FontIcon>}
			onAccept={onAcceptMock}
			onAcceptText="Accept"
			onCancel={onCancelMock}
			onCancelText="Cancel"
		></Dialog>));
	});

	it("Test Dialog component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#dialog-content')).toHaveLength(1);
		expect(wrapper.find(FontIcon)).toHaveLength(2); // Close button is also a FontIcon
	});

	it("Test Dialog without icon", () => {
		wrapper.setProps({ icon: undefined });
		expect(wrapper.find(FontIcon)).toHaveLength(1);
	});

	it("Test Dialog without accept button", () => {
		wrapper.setProps({ onAccept: undefined });
		expect(wrapper.find('#react-baseDialogAcceptBtn')).toHaveLength(0);
	});

	it("Test Dialog without cancel button", () => {
		wrapper.setProps({ onCancel: undefined });
		expect(wrapper.find('#react-baseDialogCancelBtn')).toHaveLength(0);
	});

	it("Test Dialog footer centered buttons class", () => {
		wrapper.setProps({ onCancel: undefined }); // onAccept is set
		expect(wrapper.find('footer').hasClass('center-buttons')).toBe(true);
	});
});
