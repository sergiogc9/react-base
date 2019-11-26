import React from "react";
import { act } from 'react-dom/test-utils';

import FormFileField from "@src/components/common/Form/FileField/";
import FormFileFieldWithoutStore from "@src/components/common/Form/FileField/FormFileField";
import { ComponentProps } from "@src/components/common/Form/FileField/types";
import { shallow } from "enzyme";
import TestHelper from "@src/__tests__/utils/Helper/TestHelper";

const element = TestHelper.fileFieldelement;

const file = new File([], "");

let onChangeMock = jest.fn();
let onFileErrorsMock = jest.fn();
let onAddNotificationMock = jest.fn();
describe("File field common component", () => {
	let wrapper: any;

	const updateComponent = (props: Partial<ComponentProps> = {}) => {
		act(() => {
			wrapper = TestHelper.getWrappedComponent(
				<FormFileField
					element={element}
					error={false}
					onChangeFile={onChangeMock}
					{...props}
				/>, {}).component;
		});
	};

	const getComponent = (props: Partial<ComponentProps> = {}) => (
		<FormFileFieldWithoutStore
			element={element}
			error={false}
			onChangeFile={onChangeMock}
			onAddNotification={onAddNotificationMock}
			{...props}
		/>
	);

	beforeEach(() => {
		onChangeMock = jest.fn();
		onFileErrorsMock = jest.fn();
		onAddNotificationMock = jest.fn();
		updateComponent();
	});

	it("Component default snapshot", () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component default snapshot with multiple set to true", () => {
		updateComponent({ element: { ...element, multiple: true } });
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component snapshot on remove file", () => {
		act(() => wrapper.find('Dropzone').at(0).props().onRemoveFile());
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("Component on added files", () => {
		act(() => wrapper.find('Dropzone').at(0).props().onFilesAdded([file]));
		expect(onChangeMock).toHaveBeenCalledTimes(1);
	});

	it("Component on file too large error", () => {
		wrapper = shallow(getComponent());
		act(() => wrapper.find('Dropzone').at(0).props().onAddFilesError([{ error: "file_too_large" }]));
		expect(onAddNotificationMock).toHaveBeenCalledTimes(1);
	});

	it("Component on incorrect type error", () => {
		wrapper = shallow(getComponent());
		act(() => wrapper.find('Dropzone').at(0).props().onAddFilesError([{ error: "incorrect_file_type" }]));
		expect(onAddNotificationMock).toHaveBeenCalledTimes(1);
	});

	it("Component on other error", () => {
		wrapper = shallow(getComponent());
		act(() => wrapper.find('Dropzone').at(0).props().onAddFilesError([{ error: "other_error" }]));
		expect(onAddNotificationMock).toHaveBeenCalledTimes(1);
	});

	it("Component on file errors handle", () => {
		updateComponent({ element: { ...element, onFileErrors: onFileErrorsMock } });
		act(() => wrapper.find('Dropzone').at(0).props().onAddFilesError([{ error: "other_error" }]));
		expect(onFileErrorsMock).toHaveBeenCalledTimes(1);
	});

	it("Component on validate base validation", () => {
		updateComponent({ element: { ...element, validations: { fn: () => false } } });
		act(() => wrapper.find('Dropzone').at(0).props().onFilesAdded([file]));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, [file], false);
	});

	it("Component on validate correct", () => {
		updateComponent({ element: { ...element, validations: {} } });
		act(() => wrapper.find('Dropzone').at(0).props().onFilesAdded([file]));
		expect(onChangeMock).toHaveBeenCalledWith(element.id, [file], true);
	});

	it("Component snapshot after on force update", () => {
		updateComponent({ forceValue: [file] });
		expect(onChangeMock).toHaveBeenCalledWith(element.id, [file], true);
		expect(wrapper.html()).toMatchSnapshot();
	});
});
