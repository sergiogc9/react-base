import React from 'react';
import { withT } from '@src/lib/i18n';
import FileInput from 'react-md/lib/FileInputs/FileInput';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Button from 'react-md/lib/Buttons/Button';
import isEmpty from 'lodash/isEmpty';
import { ComponentProps, AddFileError } from './types';

import './Dropzone.scss';

type ComponentState = {
	highlight: boolean,
	disabled: boolean
};

class Dropzone extends React.Component<ComponentProps, ComponentState> {

	constructor(props: ComponentProps) {
		super(props);
		this.state = {
			highlight: false,
			disabled: false
		};
	}

	private _fileListToArray(list: FileList) {
		const array: File[] = [];
		for (let i = 0; i < list.length; i++) {
			array.push(list.item(i)!);
		}
		return array;
	}

	private _getValidationExpression() {
		const { accept } = this.props;
		if (!accept) return null;

		return new RegExp('^(' + accept.replace(/[, ]+/g, '|').replace(/\/\*/g, '/.*') + ')$', 'i');
	}

	private _onDragOver(event: React.DragEvent) {
		const { disabled } = this.state;

		event.preventDefault();

		if (disabled) return;

		this.setState({ highlight: true });
	}

	private _onDragLeave() {
		this.setState({ highlight: false });
	}

	private _onDrop(event: React.DragEvent) {
		const { disabled } = this.state;
		const { multiple } = this.props;

		event.preventDefault();

		if (disabled) return;

		const droppedFiles = event.dataTransfer.files;
		let filesArray: File[] = [];

		if (multiple) filesArray = this._fileListToArray(droppedFiles);
		else if (droppedFiles.length > 0) filesArray = [droppedFiles.item(0)!];

		this._handleFilesChange(filesArray);
		this.setState({ highlight: false });
	}

	private _onFileInputChange(files: File[] | File) {
		if (!Array.isArray(files)) files = [files];
		this._handleFilesChange(files);
	}

	private _handleFilesChange(files: File[]) {
		const { maxSize } = this.props;
		const { onFilesAdded, onAddFilesError } = this.props;
		const regex = this._getValidationExpression();
		const errors: AddFileError[] = [];
		files.forEach(file => {
			const fileExtension = file.name.match(/\.[^\.]*$|$/)![0];
			if (regex && !(regex.test(file.type) || regex.test(fileExtension))) {
				errors.push({ error: 'incorrect_file_type', file });
				return;
			}

			if (maxSize && file.size > maxSize) {
				errors.push({ error: 'file_too_large', file });
				return;
			}
		});
		if (errors.length > 0) onAddFilesError(errors);
		else onFilesAdded(files);
	}

	private _renderUploadedFilesZone() {
		const { files } = this.props;
		return (
			<div id="dropzoneUploadedFiles">
				<div className="dropzone-upload-files-inner">
					{files.map((file, index) => (
						<div key={`dropzoneUploadedFile_${file.name}_${index}`} className="dropzone-uploaded-file">
							<div className="dropzone-uploaded-file-info">
								<div className="dropzone-uploaded-file-name">
									{file.name}
								</div>
							</div>
							<div className="dropzone-uploaded-file-commands">
								<Button
									id={`dropzoneUploadedFile${index}RemoveButton`}
									flat
									iconChildren="close"
									className="dropzone-uploaded-file-commands-remove"
									children=""
									onClick={() => this.props.onRemoveFile(file)}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	public componentDidUpdate(prevProps: ComponentProps, prevState: ComponentState, snapshot: any) {
		const { disabled } = this.state;
		const { multiple, files } = this.props;
		if (!disabled && !multiple && !isEmpty(files)) this.setState({ disabled: true });
		else if (disabled && (isEmpty(files) || multiple)) this.setState({ disabled: false });
	}

	public render() {
		const { multiple, files, showError, t } = this.props;
		const { highlight, disabled } = this.state;
		let containerClass = 'dropzone-outer-container';
		if (highlight) containerClass += ' highlighted-container';
		else if (disabled) containerClass += ' filled-container';
		if (showError) containerClass += ' dropzone-error';

		return (
			<div id="dropzoneContainer"
				className={containerClass}
				onDragOver={event => { event.preventDefault(); this._onDragOver(event); }}
				onDragLeave={event => this._onDragLeave()}
				onDrop={event => this._onDrop(event)}
			>
				<div className="dropzone-inner-container">
					<div className="dropzone-buttons">
						<FileInput
							id="dropzoneFileInput"
							label={t('newsletter.digest.edit.custom_image.upload.addFiles.one')}
							onChange={uploadedFiles => this._onFileInputChange(uploadedFiles!)}
							allowDuplicates={true}
							multiple={multiple}
							icon={<></>}
							disabled={disabled}
						></FileInput>
						<div className="dropzone-help">
							<FontIcon className="icon-upload"></FontIcon>
							<span>{t(`newsletter.digest.edit.custom_image.upload.dropFiles.${multiple ? 'many' : 'one'}`)}</span>
						</div>
					</div>
					{!isEmpty(files) ? this._renderUploadedFilesZone() : null}
				</div>
			</div>
		);
	}
}

export default withT(Dropzone);
