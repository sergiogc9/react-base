import React from 'react';
import Cropper, { CropperProps as ReactEasyCropperProps } from 'react-easy-crop';
import { debounce } from 'lib/imports/lodash';
import { cropImage, CropArea } from '@sergiogc9/react-utils';

import { CropperProps } from './types';

const ImageCropModal: React.FC<CropperProps> = props => {
	const { image, onImageCropped } = props;

	const [cropData, setCropData] = React.useState<ReactEasyCropperProps['crop']>({ x: 0, y: 0 });
	const [cropZoom, setCropZoom] = React.useState<number>(1);
	const [cropArea, setCropArea] = React.useState<CropArea>({
		x: 0,
		y: 0,
		width: 0,
		height: 0
	});
	const updatePreviewImage = React.useRef(
		debounce(async (img: string, area: CropArea) => {
			onImageCropped(await cropImage(img, area));
		}, 250)
	);

	React.useEffect(() => {
		updatePreviewImage.current(image, cropArea);
	}, [cropArea, image]);

	return (
		<Cropper
			aspect={1}
			crop={cropData}
			image={image}
			maxZoom={10}
			onCropChange={setCropData}
			onCropComplete={(_, area) => setCropArea(area)}
			onZoomChange={setCropZoom}
			zoom={cropZoom}
		/>
	);
};

export default React.memo(ImageCropModal);
