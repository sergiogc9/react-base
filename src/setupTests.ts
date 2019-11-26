import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from "moment-timezone";

configure({ adapter: new Adapter() });

jest.doMock('moment', () => {
	moment.tz.setDefault('Europe/Andorra'); // set same timezone to use on all machines
	return moment;
});

jest.doMock('react-i18next', () => ({
	withTranslation: () => (Component: any) => {
		Component.defaultProps = { ...Component.defaultProps, t: (k: string) => k };
		return Component;
	}
}));
