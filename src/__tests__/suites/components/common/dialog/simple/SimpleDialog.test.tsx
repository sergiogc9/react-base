import { shallow } from 'enzyme';
import React from 'react';

import SimpleDialog from '@src/components/common/dialog/simple';

let onAcceptMock: jest.Mock;
let onCancelMock: jest.Mock;

describe('<Dialog />', () => {
	let wrapper: any;

	beforeEach(() => {
		onAcceptMock = jest.fn();
		onCancelMock = jest.fn();
		wrapper = shallow((<SimpleDialog
			id="dialog-id"
			text="Dialog title"
			content={(<div id="dialog-content"></div>)}
			onAccept={onAcceptMock}
			onAcceptText="Accept"
			onCancel={onCancelMock}
			onCancelText="Cancel"
		></SimpleDialog>));
	});

	it("Test Dialog component snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
		expect(wrapper.find('#dialog-content')).toHaveLength(1);
		expect(wrapper.find('#react-baseDialogAcceptBtn')).toHaveLength(1);
		expect(wrapper.find('#react-baseDialogCancelBtn')).toHaveLength(1);
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
		expect(wrapper.find('.dialog-footer').hasClass('center-buttons')).toBe(true);
	});
});
