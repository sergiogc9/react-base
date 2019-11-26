import React from "react";
import { shallow } from "enzyme";
import cloneDeep from 'lodash/cloneDeep';

import Dropzone from '@src/components/common/Dropzone/Dropzone';

const date = new Date();

const file = {
	lastModified: date.getTime(),
	name: 'test_file.png',
	size: 30000,
	type: 'image/png',
};

const extraFile = {
	lastModified: date.getTime(),
	name: 'test_extra_file.mp4',
	size: 30000,
	type: 'video/mp4',
};

const mockFileList = {
	files: [file, extraFile],
	length: 2,
	item(index: number) {
		return this.files[index];
	}
};

const event = {
	preventDefault: () => false,
	dataTransfer: { files: mockFileList }
};

describe("Test dropzone component", () => {

	let wrapper: any;
	let dropzone: any;
	let fileInput: any;
	let onFilesAdded: any;
	let onAddFilesError: any;
	let onRemoveFile: any;

	beforeEach(() => {
		onFilesAdded = jest.fn();
		onAddFilesError = jest.fn();
		onRemoveFile = jest.fn();

		wrapper = shallow(
			<Dropzone
				files={[]}
				multiple={false}
				onFilesAdded={onFilesAdded}
				onAddFilesError={onAddFilesError}
				onRemoveFile={onRemoveFile}
			/>
		);
		dropzone = wrapper.find("#dropzoneContainer").at(0);
		fileInput = wrapper.find("#dropzoneFileInput").at(0);
	});

	it("Test on drag over / leave", () => {
		dropzone.props().onDragOver(event);
		expect(wrapper.state('highlight')).toEqual(true);
		dropzone.props().onDragLeave(event);
		expect(wrapper.state('highlight')).toEqual(false);
	});

	it("Test drop one file", () => {
		expect(onFilesAdded).toHaveBeenCalledTimes(0);
		dropzone.props().onDrop(event);
		expect(onFilesAdded).toHaveBeenCalledTimes(1);
		expect(onFilesAdded).toHaveBeenCalledWith([file]);
	});

	it("Test drop multiple files", () => {
		expect(onFilesAdded).toHaveBeenCalledTimes(0);
		wrapper.setProps({ multiple: true });
		dropzone.props().onDrop(event);
		expect(onFilesAdded).toHaveBeenCalledTimes(1);
		expect(onFilesAdded).toHaveBeenCalledWith([file, extraFile]);
	});

	it("Test drop no files", () => {
		const modifiedEvent = cloneDeep(event);
		modifiedEvent.dataTransfer.files = {
			...mockFileList,
			files: [],
			length: 0
		};
		expect(onFilesAdded).toHaveBeenCalledTimes(0);
		dropzone.props().onDrop(modifiedEvent);
		expect(onFilesAdded).toHaveBeenCalledTimes(1);
		expect(onFilesAdded).toHaveBeenCalledWith([]);
	});

	it("Test file input", () => {
		expect(onFilesAdded).toHaveBeenCalledTimes(0);
		fileInput.props().onChange(file);
		expect(onFilesAdded).toHaveBeenCalledTimes(1);
		expect(onFilesAdded).toHaveBeenCalledWith([file]);
	});

	it("Test file input multiple files", () => {
		const fileList = [file, extraFile];
		wrapper.setProps({ multiple: true });

		expect(onFilesAdded).toHaveBeenCalledTimes(0);
		fileInput.at(0).props().onChange(fileList);

		expect(onFilesAdded).toHaveBeenCalledTimes(1);
		expect(onFilesAdded).toHaveBeenCalledWith(fileList);
	});

	it("Test file type validation", () => {
		wrapper.setProps({ accept: 'image/*' });
		dropzone.props().onDrop(event);
		expect(onFilesAdded).toHaveBeenCalledTimes(1);
		expect(onFilesAdded).toHaveBeenCalledWith([file]);

		wrapper.setProps({ accept: 'image/png' });
		dropzone.props().onDrop(event);
		expect(onFilesAdded).toHaveBeenCalledTimes(2);
		expect(onFilesAdded).toHaveBeenCalledWith([file]);

		wrapper.setProps({ accept: '.png' });
		dropzone.props().onDrop(event);
		expect(onFilesAdded).toHaveBeenCalledTimes(3);
		expect(onFilesAdded).toHaveBeenCalledWith([file]);

		wrapper.setProps({ accept: 'video/mp4' });
		dropzone.props().onDrop(event);

		expect(onFilesAdded).toHaveBeenCalledTimes(3);
		expect(onAddFilesError).toHaveBeenCalledTimes(1);
		expect(onAddFilesError).toHaveBeenCalledWith([{ error: 'incorrect_file_type', file }]);
	});

	it("Test file size validation", () => {
		wrapper.setProps({ maxSize: 1000 });
		dropzone.props().onDrop(event);
		expect(onFilesAdded).toHaveBeenCalledTimes(0);
		expect(onAddFilesError).toHaveBeenCalledTimes(1);
		expect(onAddFilesError).toHaveBeenCalledWith([{ error: 'file_too_large', file }]);
	});

	it("Test files render", () => {
		wrapper.setProps({ files: [file, extraFile] });
		expect(wrapper.find('#dropzoneUploadedFiles').html()).toMatchSnapshot();
	});

	it("Test file delete button", () => {
		wrapper.setProps({ files: [file, extraFile] });
		wrapper.find('.dropzone-uploaded-file-commands-remove').at(0).simulate('click');
		expect(onRemoveFile).toBeCalledTimes(1);
		expect(onRemoveFile).toHaveBeenCalledWith(file);
	});

	it("Test disabled behaviour", () => {
		wrapper.setProps({ files: [file] });
		expect(wrapper.state('disabled')).toEqual(true);

		dropzone.props().onDragOver(event);
		expect(wrapper.state('highlight')).toEqual(false);

		dropzone.props().onDrop(event);
		expect(onFilesAdded).toHaveBeenCalledTimes(0);

		wrapper.setProps({ files: [file, extraFile], multiple: true });
		expect(wrapper.state('disabled')).toEqual(false);
	});
});
