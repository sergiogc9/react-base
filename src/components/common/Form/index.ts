import { createNameSpacedComponent } from '@sergiogc9/react-utils';

import FormButtonSubmit from './Button/Submit';
import FormCheckBox from './CheckBox';
import FormAppGoogleMapsAutocomplete from './AppGoogleMapsAutocomplete';
import FormTextField from './TextField';
import FormSelect from './Select';
import FormTextArea from './TextArea';
import FormSwitchBox from './SwitchBox';
import Form from './Form';

export default createNameSpacedComponent(Form, {
	AppGoogleMapsAutocomplete: FormAppGoogleMapsAutocomplete,
	ButtonSubmit: FormButtonSubmit,
	CheckBox: FormCheckBox,
	Select: FormSelect,
	SwitchBox: FormSwitchBox,
	TextArea: FormTextArea,
	TextField: FormTextField
});
