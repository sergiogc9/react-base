import React from 'react';

import { mount } from 'enzyme';
import Snackbar from 'react-md/lib/Snackbars/SnackbarContainer';

import Notifications from '@src/components/App/Notifications/Notifications';

describe('<Notifications />', () => {
	let wrapper: any;

	beforeEach(() => {
		wrapper = mount((<Notifications
			notifications={[]}
			onAddNotification={() => { }}
			onUnqueueNotification={() => { }}
		></Notifications>));
		jest.useFakeTimers();
	});

	it('should not render <Snackbar /> when not receiving notifications', () => {
		expect(wrapper.find(Snackbar)).toHaveLength(0);
	});

	it('should render <Snackbar /> when receiving notifications', () => {
		wrapper.setProps({ notifications: [{ text: "Notificació", level: "info" }] });
		expect(wrapper.find(Snackbar)).toHaveLength(1);
	});

	it('should render <Snackbar /> with success class only', () => {
		wrapper.setProps({ notifications: [{ text: "Notificació", level: "success" }] });
		expect(wrapper.find(Snackbar).hasClass('success')).toEqual(true);
		expect(wrapper.find(Snackbar).hasClass('info')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('warning')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('danger')).toEqual(false);
	});

	it('should render <Snackbar /> with info class only', () => {
		wrapper.setProps({ notifications: [{ text: "Notificació", level: "info" }] });
		expect(wrapper.find(Snackbar).hasClass('success')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('info')).toEqual(true);
		expect(wrapper.find(Snackbar).hasClass('warning')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('danger')).toEqual(false);
	});

	it('should render <Snackbar /> with warning class only', () => {
		wrapper.setProps({ notifications: [{ text: "Notificació", level: "warning" }] });
		expect(wrapper.find(Snackbar).hasClass('success')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('info')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('warning')).toEqual(true);
		expect(wrapper.find(Snackbar).hasClass('danger')).toEqual(false);
	});

	it('should render <Snackbar /> with danger class only', () => {
		wrapper.setProps({ notifications: [{ text: "Notificació", level: "danger" }] });
		expect(wrapper.find(Snackbar).hasClass('success')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('info')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('warning')).toEqual(false);
		expect(wrapper.find(Snackbar).hasClass('danger')).toEqual(true);
	});

	it('should render <Snackbar /> and then disappear after timeout', done => {
		wrapper.setProps({
			notifications: [{ text: "Notificació", level: "info", timeout: 3000 }],
			onUnqueueNotification: () => {
				wrapper.setProps({ notifications: [] });
			}
		});
		expect(wrapper.find(Snackbar)).toHaveLength(1);

		setTimeout(() => {
			expect(wrapper.find(Snackbar)).toHaveLength(0);
			done();
		}, 4000);

		jest.runAllTimers();
	});

	it('should render <Snackbar /> and keep it without timeout', done => {
		wrapper.setProps({
			notifications: [{ text: "Notificació", level: "info", timeout: false }],
			onUnqueueNotification: () => {
				wrapper.setProps({ notifications: [] });
			}
		});
		expect(wrapper.find(Snackbar)).toHaveLength(1);

		setTimeout(() => {
			expect(wrapper.find(Snackbar)).toHaveLength(1);
			done();
		}, 4000);

		jest.runAllTimers();
	});

	it("check bug when notifications have same id", done => {
		wrapper.setProps({ notifications: [{ id: 1, text: "First notification", level: "danger" }] });
		expect(wrapper.find(Snackbar).props().toasts).toEqual([{ id: 1, text: "First notification", level: "danger" }]);
		setTimeout(() => {
			wrapper.setProps({ notifications: [] });
			expect(wrapper.find(Snackbar)).toHaveLength(0);
			wrapper.setProps({ notifications: [{ id: 1, text: "Second notification", level: "success" }] });
			expect(wrapper.find(Snackbar).props().toasts).toEqual([{ id: 1, text: "Second notification", level: "success" }]);
			done();
		}, 6000);

		jest.runAllTimers();
	});
});
