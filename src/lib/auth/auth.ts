import { UserProfile } from 'types/entities/user';

/**
 * This file aims to simulate a simple auth service
 */

let __user: UserProfile | null = null;

const redirectToSSO = () => window.top?.location.assign(`https://gironafc.cat`); // Should get SSO url from config

const doLogin = async () => {
	await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating authentication waiting timeF

	__user = { id: 'fake-id', name: 'Sergio', surnames: 'Gómez Cosgaya' };
	return __user;
};

const doLogout = () => {
	__user = null;
	redirectToSSO();
};

const getUser = () => __user;

export default {
	doLogin,
	doLogout,
	getUser,
	redirectToSSO
};
