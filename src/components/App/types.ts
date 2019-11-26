import { TenantObject } from "@src/class/Tenant";
import { UserObject } from "@src/class/User";
import { FacebookAuthStatus } from "@src/types/facebook";
import { TProps } from '@src/lib/i18n';

export type StateProps = {
	authenticated: boolean
	tenant: TenantObject | null
	user: UserObject | null
};

export type DispatchProps = {
	onAuth: () => void
};

export type OwnProps = {};

export type ComponentProps = StateProps & DispatchProps & OwnProps & TProps;
