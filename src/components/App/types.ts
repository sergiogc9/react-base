import { TProps } from '@src/lib/i18n';

export type StateProps = {
	authenticated: boolean
};

export type DispatchProps = {
	onAuth: () => void
};

export type OwnProps = {};

export type ComponentProps = StateProps & DispatchProps & OwnProps & TProps;
