import { ProfileObject } from '@src/class/Profile';

export type ApiSession = {
	token: string
	token_expires_at: string
};

export type Session = {
	profile: ProfileObject
	api: ApiSession
};
