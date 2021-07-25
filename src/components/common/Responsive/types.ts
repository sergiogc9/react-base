import { Theme } from '@sergiogc9/react-ui-theme';

export type ComponentProps = React.PropsWithChildren<{
	visibility: Array<keyof Theme['breakpoints']>;
}>;
