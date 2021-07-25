type Props = {
	/**
	 * The image in Base64. If null, no image has been set before.
	 */
	readonly image: string;
	/**
	 * A callback method called with the cropped image data
	 */
	readonly onImageCropped: (image: string) => void;
};

export type CropperProps = Props;
