import { get, has, forEach, isArray, isObject } from 'lib/imports/lodash';

import { ApiConfig, ApiConfigNotification, Notification } from 'types/notification';

/*
Api middleware to show automatically notifications on api responses.
Notification configuration:
- See notification types docs (in types/notification.ts)
- In notification config, you can interpolate values from api response, see ApiConfigNotification type and documentation below.
- You can enable or disable a notification by the redux or react-query action type. Also different notifications can be set depending on api response code.
- There is a "common" property to specify common notifications for a specific api response code for all action types.

Showing text from api response in notifications:
In api notifications config, instead of passing string to 'text' or 't' properties, you can use path to get the value from api response.
As a simple example, you can use a text:
{
	text: 'Some notification text'
}
Or use some text from api response:
{
	text: { path: 'error.message' } <-- This will show the text from api response in response.error.message
}

By default:
- Success responses (api = 'success') do NOT show notifications
- Success responses can be forced to show a notification by config using the action type
- Error responses (api = 'error') show a default notification
- Error responses can be forced to not show a notification by config (setting the value to false) using the action type
- If action meta has a reload value, action notification timeout is automatically set to false (the notification is not removed until reload button is clicked)

The config selection behavior is the following:
- If a config is defined for the action type and the api response code, it is used to show the notification
- Otherwise, if a config is defined for the action type, it is used to show the notification
- Otherwise, if a config is defined for the store path, it is used to show the notification
- Otherwise, if exists a common notification config for the code (e.g. WRONG_PARAMETERS) it is used to show the notification
- Otherwise, if not config is not defined for specific action or code then a default notification is used

EXAMPLES:
Set a notification for a whole store path:
{
	"@@entities/book": { <-- Store path
		t: 'book.fetch_books_error',
		level: 'error'
	}
}

Set a notification for a specific action:
{
	"@@entities/book": { <-- Store path
		fetchBookError: { <-- Action type (without store path)
			t: 'book.fetch_books_error',
			level: 'error'
		}
	}
}

Set a notification for a specific action and response code:
{
	"@@entities/book": { <-- Store path
		fetchBookError: { <-- Action type (without store path)
			WRONG_PARAMETERS: { <-- Api response code
				t: 'book.fetch_books_wrong_params',
				level: 'error'
			},
			BOOKS_EMPTY: { <-- Another api response code with another notification
				t: 'book.fetch_books_empty',
				level: 'warning'
			}
		}
	}
}

Set a common notification for a specific api response code:
{
	"common": {
		WRONG_PARAMETERS: { <-- Api response code
			t: 'api.errors.wrong_params',
			level: 'error'
		}
	}
}

Set a notification for a specific action using text from api response:
{
	"@@entities/book": { <-- Store path
		fetchBookError: { <-- Action type (without store path)
			text: { path: 'error.message' }
		}
	}
}

Set a notification for a specific action using text from api response and interpolation:
{
	"@@entities/book": { <-- Store path
		fetchBookError: { <-- Action type (without store path)
			t: ['book.fetch_books_error', { bookName: {'error.book.name' } }] <-- This will show the multi language text from i18n change "bookName" with value from response in response.error.book.name
		}
	}
}

Disable notifications for a whole store path:
{
	"@@entities/book": false <-- Store path
}

Disable notifications for a specific action:
{
	"@@entities/book": { <-- Store path
		fetchBookError: false <-- Action type (without store path)
	}
}

Disable notifications for a specific action and response code:
{
	"@@entities/book": { <-- Store path
		fetchBookError: { <-- Action type (without store path)
			WRONG_PARAMETERS: false <-- Api response code
		}
	}
}

Disable notifications for a specific api response code:
{
	"common": {
		WRONG_PARAMETERS: false <-- Api response code
	}
}
*/

const __isNotificationConfig = (candidate: any) => {
	if (candidate === false) return true;
	if (isObject(candidate) && ('t' in candidate || 'text' in candidate)) return true;
	return false;
};

export const defaultApiErrorNotification: Notification = {
	t: 'api.default_error',
	level: 'error'
};

export const getNotificationFromConfigResult = (response: any, configResult?: ApiConfigNotification): Notification => {
	const notification = configResult || defaultApiErrorNotification;

	if (notification.t && isArray(notification.t)) {
		const interpolation = notification.t[1];
		const parsedInterpolation: Record<string, string> = {};
		forEach(interpolation, (value, key) => {
			if (has(value, 'path')) parsedInterpolation[key] = get(response, get(value, 'path'));
			else parsedInterpolation[key] = value as string;
		});
		notification.t[1] = parsedInterpolation;
	}
	if (notification.text && has(notification.text, 'path')) {
		notification.text = get(response, get(notification.text, 'path'));
	}
	return notification as Notification;
};

/* 	responseCode is only used in error actions
	Returns:
		- notification if config found with a non false value
		- false if config found with a false value
		- null if not config found
*/
export const getNotificationConfig = (
	library: 'redux' | 'reactQuery',
	config: ApiConfig,
	actionGroup: string,
	actionName: string,
	responseCode: string
): Notification | false | undefined => {
	// Check for action type and code specific config
	let result = get(config, [library, actionGroup, actionName, responseCode]);
	if (__isNotificationConfig(result)) return result;
	// Check for action type specific config
	result = get(config, [library, actionGroup, actionName]);
	if (__isNotificationConfig(result)) return result;
	// Check for store path config
	result = get(config, [library, actionGroup]);
	if (__isNotificationConfig(result)) return result;
	// Check for common response type config
	result = get(config, ['common', responseCode]);
	if (__isNotificationConfig(result)) return result;
	return undefined;
};
