import { TProps } from '@src/lib/i18n';

export type AddFileError = {
	error: 'file_too_large' | 'incorrect_file_type'
	file: File
};

export type StateProps = {};

export type DispatchProps = {};

export type OwnProps = {
	files: File[]
	multiple: boolean
	accept?: string
	maxSize?: number
	showError?: boolean
	onFilesAdded(files: File[]): void
	onAddFilesError(errors: AddFileError[]): void
	onRemoveFile(file: File): void
};

export type ComponentProps = StateProps & DispatchProps & OwnProps & TProps;
