import React from 'react';

import Dropzone from '@src/components/common/Dropzone/Dropzone';
import { AddFileError } from '@src/components/common/Dropzone/types';
import { withT } from '@src/lib/i18n';
import { FileFieldElement } from '@src/types/form';
import { formFieldBaseValidation } from '@src/components/common/Form/Form';
import { useForceFieldValue } from '@src/lib/hooks';
import { ComponentProps } from './types';

import './FormFileField.scss';

const __validateFileField = (element: FileFieldElement, newValue: File[]) => {
	if (!formFieldBaseValidation(element, newValue)) return false;
	if (!element.validations) return true;
	return true;
};

const FormFileField = (props: ComponentProps) => {
	const { element, forceValue, error, onChangeFile, onAddNotification } = props;

	const [files, setFiles] = React.useState<File[] | null>(null);
	useForceFieldValue(forceValue, null, element, setFiles, onChangeFile, __validateFileField);

	const onFilesAdded = React.useCallback((files: File[]) => {
		setFiles(files);
		onChangeFile(element.id, files, __validateFileField(element, files));
	}, [element, onChangeFile]);

	const onFileErrors = React.useCallback((errors: AddFileError[]) => {
		const error = errors[0];
		if (element.onFileErrors) return element.onFileErrors(errors);
		if (error.error === 'file_too_large') onAddNotification({ t: 'newsletter.digest.edit.custom_image.rejected_size', level: 'warning' });
		else if (error.error === 'incorrect_file_type') onAddNotification({ t: 'newsletter.digest.edit.custom_image.rejected_type', level: 'warning' });
		else onAddNotification({ t: 'newsletter.digest.edit.custom_image.upload_error', level: 'warning' });
	}, [element, onAddNotification]);

	const onRemoveFile = React.useCallback(() => setFiles(null), []);

	return (
		<div className='discover-form-file-field' >
			<Dropzone
				files={files || []}
				multiple={element.multiple}
				accept={element.accept}
				maxSize={element.maxSize}
				showError={error}
				onFilesAdded={onFilesAdded}
				onAddFilesError={onFileErrors}
				onRemoveFile={onRemoveFile}
			></Dropzone>
		</div >
	);
};

export default withT(React.memo(FormFileField));
