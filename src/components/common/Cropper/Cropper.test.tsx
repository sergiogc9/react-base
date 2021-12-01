import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithMockedStore, StateSlice } from 'lib/tests/redux';
import Cropper from 'components/common/Cropper';
import { CropperProps } from './types';

const text = 'cropper!';

const image = 'fake-default-image';
const croppedImg = 'fake-cropped-image';
const mockOnImageCropped = jest.fn();

jest.mock('react-easy-crop', () => ({
	__esModule: true,
	default: (props: any) => (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<div onClick={() => props.onCropComplete({ x: 10, y: 10, width: 20, height: 30 })}>{text}</div>
	)
}));
jest.mock('@sergiogc9/react-utils', () => {
	const currentPackage = jest.requireActual('@sergiogc9/react-utils');
	return {
		...currentPackage,
		cropImage: () => croppedImg
	};
});

const renderComponent = (props: Partial<CropperProps> = {}, stateSlice: StateSlice = {}) =>
	renderWithMockedStore(<Cropper image={image} onImageCropped={mockOnImageCropped} {...props} />, stateSlice);

describe('Cropper', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render cropper by default', () => {
		renderComponent();
		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it('should return cropped image at mount', async () => {
		renderComponent();
		await waitFor(() => expect(mockOnImageCropped).toHaveBeenCalled());
	});

	it('should return cropped image when crop ends', async () => {
		renderComponent();
		fireEvent.click(screen.getByText(text));
		await waitFor(() => expect(mockOnImageCropped).toHaveBeenCalled());
		expect(mockOnImageCropped).toHaveBeenCalledWith(croppedImg);
	});
});
