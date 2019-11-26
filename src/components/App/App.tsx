import React from 'react';
import Tab from 'react-md/lib/Tabs/Tab';
import Tabs from 'react-md/lib/Tabs/Tabs';
import { Redirect, Route, Switch, Link } from 'react-router-dom';
import keys from 'lodash/keys';

import FacebookProvider from './Facebook';
import AppToolbar from '@src/components/App/Toolbar';
import Notifications from '@src/components/App/Notifications';
import Article from '@src/components/Article';
import Focus from '@src/components/Focus';
import Newsletter from '@src/components/Newsletter';
import { TenantObject } from '@src/class/Tenant';
import { User } from '@src/class/User';
import { ComponentProps } from './types';

import { withT } from '@src/lib/i18n';

import './App.scss';

class App extends React.Component<ComponentProps> {

	private tabIndex: { [tab: string]: number } = {
		article: 0, // Feeds
		focus: 0, // Feeds
		newsletter: 1 // Newsletter
	};

	private appPath = `/:section(${keys(this.tabIndex).join('|')})`;

	public componentDidMount() {
		const { authenticated, onAuth } = this.props;
		if (!authenticated) onAuth();
	}

	public render() {
		const { authenticated, tenant, user: userObject, t } = this.props;

		if (!authenticated) return (<div id="appLoader"><img src="/appLoader.svg" alt="" /></div>);

		const user = new User(userObject!);

		const tenantId = (tenant as TenantObject).id;
		const language = user.settings.language_code;

		return (
			<div id="app">
				<FacebookProvider language={language}>
					<AppToolbar />
					<Switch>
						<Route path={this.appPath} render={({ match }) => {
							const activeTabIndex = this.tabIndex[match.params.section];
							return (
								<div id="appWrapper">
									<div className="app-tabs-line">
										<div className="app-tabs-wrapper">
											<Tabs mobile tabId="appTabs" activeTabIndex={activeTabIndex} onTabChange={() => { }}>
												<Tab key='feeds' component={Link} to="/article" label={t('tabs.articles')} />
												{user.hasPermission('newsletter.list') ?
													<Tab key='newsletter' component='a' href={process.env.REACT_APP_SERVER_URL + "/newsletter"} label={t('tabs.newsletters')} /> : <></>}
												<Tab key='reports' component='a' href={process.env.REACT_APP_REPORTS_URL + "?tenant=" + tenantId} label={t('tabs.analytics')} />
											</Tabs>
										</div>
									</div>
									<div id="appContent">
										<Switch>
											<Route path="/article" component={Article} />
											<Route path="/focus" component={Focus} />
											<Route path="/newsletter" component={Newsletter} />
										</Switch>
									</div>
								</div>
							);
						}} />
						<Route path="/" render={() => (<Redirect to="/article" />)} />
					</Switch>
					<Notifications />
				</FacebookProvider>
			</div>
		);
	}
}

export default withT(App);
