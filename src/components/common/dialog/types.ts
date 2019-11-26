import { TProps } from '@src/lib/i18n';

export type StateProps = {
};

export type DispatchProps = {
};

export type OwnProps = {
	id: string
	icon?: JSX.Element
	title: string
	content: JSX.Element
	onAccept?: () => void
	onAcceptText?: string
	onCancel?: () => void
	onCancelText?: string
};

export type ComponentProps = StateProps & DispatchProps & OwnProps & TProps;
