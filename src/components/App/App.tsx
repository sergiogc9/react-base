import React from 'react';
import PacmanLoader from "react-spinners/PacmanLoader";

import Notifications from '@src/components/App/Notifications';
import { ComponentProps } from './types';

import { withT } from '@src/lib/i18n';

import './App.scss';

class App extends React.Component<ComponentProps> {

	public componentDidMount() {
		const { authenticated, onAuth } = this.props;
		if (!authenticated) onAuth();
	}

	public render() {
		const { authenticated } = this.props;

		if (!authenticated) return (<div id="appLoader"><PacmanLoader color="#4df7b9" size={35} /></div>);
		return (
			<div id="app">
				<Notifications />
			</div>
		);
	}
}

export default withT(App);
