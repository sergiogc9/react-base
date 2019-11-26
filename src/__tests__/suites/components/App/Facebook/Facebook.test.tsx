import React from 'react';

import { shallow } from 'enzyme';

import Facebook from '@src/components/App/Facebook/Facebook';

describe('<Facebook />', () => {

	it('should render <LoginStatus/> component', () => {
		const wrapper = shallow(<Facebook
			language="es"
			onUpdateFacebookAuth={() => { }}
			children={null}
		/>);
		expect(wrapper.find('LoginStatus')).toHaveLength(1);
	});

	it('should render children component', () => {
		const wrapper = shallow(<Facebook
			language="es"
			onUpdateFacebookAuth={() => { }}
			>
			<div id="testChildren"></div>
		</Facebook>);

		expect(wrapper.find('LoginStatus')).toHaveLength(1);
		expect(wrapper.find('#testChildren')).toHaveLength(1);
	});

	it('should call onUpdateFacebookAuth function', () => {
		const onUpdateFacebookAuth = jest.fn();
		const wrapper = shallow((<Facebook
			language="es"
			onUpdateFacebookAuth={onUpdateFacebookAuth}
			children={null}
		></Facebook>));

		(wrapper.instance() as any).onFacebookStatusChange({status: 'connected', authResponse: {}});

		expect(onUpdateFacebookAuth).toBeCalledTimes(1);
	});

});
