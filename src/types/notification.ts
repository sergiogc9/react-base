export type NotificationLevels = "success" | "info" | "warning" | "danger";

interface InterpolationObject {
	[key: string]: string | { path: string }; // Path in payload for use in middleware, e.g.: "error.tenant"
}

export interface Notification {
	text?: string;
	t?: string | [string, InterpolationObject];
	level?: NotificationLevels;
	timeout?: number | false;
	buttonIcon?: string; // Only fontIcon icons,
	buttonText?: string;
}

export interface QueueNotification {
	id: number;
	text: string;
	level: NotificationLevels;
	timeout?: number | false;
	buttonIcon?: string; // Only fontIcon icons,
	buttonText?: string;
}
