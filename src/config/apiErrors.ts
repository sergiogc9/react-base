const config: { [index: string]: any } = {
	"common": {
		USER_NOT_ALLOWED: {
			t: ["error.api_alert_prefix_react", { errorMessage: { path: "error.message" } }],
			level: "warning"
		},
		MAINTENANCE: {
			t: "maintenance_mode.notification",
			level: "warning"
		}
	},
	"@@app/auth": {
		WRONG_USER: {
			ALREADY_EXISTS: {
				t: "facebook_login.account_already_exists",
				level: "info"
			}
		}
	}
};

export default config;
