import React from 'react';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';
import Main from './Main';
import GA from '@src/lib/googleAnalytics';

WebFontLoader.load({
	google: {
		families: ['Raleway', 'Montserrat', 'Libre Baskerville', 'Material Icons']
	},
	custom: {
		families: ['icomoon'],
		urls: ['/icomoon/style.css']
	}
});

GA.init();

ReactDOM.render((<Main />), document.getElementById('root') as HTMLElement);
