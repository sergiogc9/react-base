/**
 Property docs:
	- text: The text itself to show in notification
	- t: i18n key to use if multi language is needed. Use array format if you need interpolation values (see examples below)
	- level: sets the level of the notification. Level basically changes notification colour. Default: info
	- timeout: sets notification timeout hiding behavior.
		If number, its value represents the number of milliseconds the notification is shown.
		If false the notification is not hidden automatically.
		Default: 5000ms
	- reload: If true a reload button will appear to force reload the page

Examples:
Let's suppose we have following i18n keys and values:
	- 'api.wrong_permission' = "You don't have enough permissions"
	- 'api.wrong_user' = "The user {{user}} does not exists"

- Success notification showing during 10 seconds using custom text
{
	text: 'This is a custom text not translated',
	level: 'success',
	timeout: 10000
}

- Error notification using a i18n translated text without interpolation
{
	t: 'api.wrong_permission',
	level: 'error'
}
This should show 'You don't have enough permissions'

- Warning notification using a i18n translated text using interpolation, showing a reload page button
{
	t: ['api.wrong_user', {user: 'sergio'}]
}
This should show: The user sergio does not exists
*/

export type NotificationLevels = 'success' | 'info' | 'warning' | 'error';

export type Notification = {
	text?: string;
	t?: string | [string, Record<string, string>];
	level?: NotificationLevels;
	timeout?: number | false;
	reload?: boolean;
};

// From here, only used in config for api response middleware
type InterpolationObject = {
	[key: string]: string | { path: string }; // Path in payload for use in middleware, e.g.: "error.tenant"
};

export type ApiConfigNotification = Omit<Notification, 'text' | 't'> & {
	text?: string | { path: string };
	t?: string | [string, InterpolationObject];
};

export type ApiConfig = {
	[key: string]: ApiConfig | ApiConfigNotification | false;
};
