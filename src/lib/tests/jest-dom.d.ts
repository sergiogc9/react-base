declare namespace jest {
	interface Matchers {
		toHaveStyleRule(cssAttribute: string, value?: any): any;
	}
}
