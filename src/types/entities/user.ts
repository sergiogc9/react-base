export const languages = ['en', 'es'] as const;
export type Language = typeof languages[number];

export type UserProfile = {
	id: string;
	name: string;
	surnames: string;
};
