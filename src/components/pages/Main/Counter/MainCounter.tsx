import React from 'react';
import { Button, Grid, TextField } from '@sergiogc9/react-ui';

export type ComponentProps = {
	defaultValue: number;
	onIncrement: () => void;
	onSetValue: (value: number) => void;
};

const MainCounter: React.FC<ComponentProps> = props => {
	const { defaultValue } = props;
	const { onIncrement, onSetValue } = props;

	const [value, setValue] = React.useState(defaultValue);

	return (
		<Grid columns={12} id="mainCounter" flexDirection="column">
			<Grid.Row>
				<TextField
					data-testid="counter-input"
					onChange={e => setValue(+e.target.value)}
					label="Value"
					placeholder="Enter a new value"
					type="number"
					value={value}
				/>
			</Grid.Row>
			<Grid.Box columns={6}>
				<Button name="value" onClick={() => onSetValue(value)} width="100%">
					Set value
				</Button>
			</Grid.Box>
			<Grid.Box columns={6}>
				<Button name="increment" onClick={onIncrement} width="100%">
					Increment by 1
				</Button>
			</Grid.Box>
		</Grid>
	);
};

export default React.memo(MainCounter);
