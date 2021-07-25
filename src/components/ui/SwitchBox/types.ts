import { BoxProps, SwitchProps } from '@sergiogc9/react-ui';

export type SwitchBoxProps = Pick<SwitchProps, 'isChecked' | 'isDefaultChecked' | 'isDisabled' | 'onChange'> & BoxProps;
