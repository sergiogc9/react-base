import { createNameSpacedComponent } from '@sergiogc9/react-utils';

import FormButtonSubmit from './Button/Submit';
import FormCheckBox from './CheckBox';
import FormGoogleMapsAutocomplete from './GoogleMapsAutocomplete';
import FormTextField from './TextField';
import FormSelect from './Select';
import FormTextArea from './TextArea';
import Form from './Form';

export default createNameSpacedComponent(Form, {
	ButtonSubmit: FormButtonSubmit,
	CheckBox: FormCheckBox,
	GoogleMapsAutocomplete: FormGoogleMapsAutocomplete,
	Select: FormSelect,
	TextArea: FormTextArea,
	TextField: FormTextField
});
