import { TProps } from '@src/lib/i18n';
import { Notification } from '@src/types/notification';
import { FileFieldElement } from '@src/types/form';

export type StateProps = {};

export type DispatchProps = {
	onAddNotification(notifcation: Notification): void
};

export type OwnProps = {
	element: FileFieldElement,
	forceValue?: File[] | null,
	error: boolean,
	onChangeFile: (elementId: string, images: File[], isValid: boolean) => void
};

export type ComponentProps = StateProps & DispatchProps & OwnProps & TProps;
