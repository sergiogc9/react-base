import React from 'react';

export type ComponentProps = {
	defaultValue: number
	onIncrement: () => void
	onSetValue: (value: number) => void
}

const MainCounter: React.FC<ComponentProps> = props => {
	const { defaultValue } = props;
	const { onIncrement, onSetValue } = props;

	const [value, setValue] = React.useState(defaultValue);

	return (
		<div id="counterTest" className="App">
			<input type='number' value={value} onChange={e => setValue(+(e.target.value))} placeholder="Enter new text" data-testid='value-input'></input>
			<button name='setValue' onClick={() => onSetValue(value)}>Set value</button>
			<button name='increment' onClick={onIncrement}>Increment by 1</button>
		</div>
	);
};

export default React.memo(MainCounter);
