import { TProps } from '@src/lib/i18n';
import { DateFieldElement } from '@src/types/form';
import { UserObject } from '@src/class/User';

export type StateProps = {
	user: UserObject
};

export type DispatchProps = {};

export type OwnProps = {
	element: DateFieldElement,
	forceValue?: Date,
	error: boolean,
	onChangeDate: (elementId: string, num: Date, isValid: boolean) => void
};

export type ComponentProps = StateProps & DispatchProps & OwnProps & TProps;
