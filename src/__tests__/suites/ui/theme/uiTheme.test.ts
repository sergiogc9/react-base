import theme from 'ui/theme';

describe('UI theme', () => {

	it("should have theme values", () => {
		expect(theme.palette.primary.main).toBe('#06a7e2');
	});
});
