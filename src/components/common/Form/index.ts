import { createNameSpacedComponent } from '@sergiogc9/react-utils';

import FormButtonCancel from './Button/Cancel';
import FormButtonSubmit from './Button/Submit';
import FormCheckBox from './CheckBox';
import FormAppGoogleMapsAutocomplete from './AppGoogleMapsAutocomplete';
import FormTextField from './TextField';
import FormSelect from './Select';
import FormTextArea from './TextArea';
import FormSwitchBox from './SwitchBox';
import Form from './Form';

export type { FormErrors, FormHelpers, FormProps } from './types';
export default createNameSpacedComponent(Form, {
	AppGoogleMapsAutocomplete: FormAppGoogleMapsAutocomplete,
	ButtonCancel: FormButtonCancel,
	ButtonSubmit: FormButtonSubmit,
	CheckBox: FormCheckBox,
	Select: FormSelect,
	SwitchBox: FormSwitchBox,
	TextArea: FormTextArea,
	TextField: FormTextField
});
