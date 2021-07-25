const path = require('path');

module.exports = {
	jest: {
		configure: {
			coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary', 'cobertura'],
			collectCoverageFrom: [
				'**/*.{ts,tsx}',
				'!src/docs/**/*.{ts,tsx}',
				'!**/index.tsx',
				'!src/serviceWorker.ts',
				'!src/lib/tests/**/*.{js,jsx,ts,tsx}',
				'!src/scripts/**/*.{js,jsx,ts,tsx}'
			],
			coverageThreshold: {
				global: {
					statements: 80,
					branches: 80,
					functions: 80,
					lines: 80
				}
			},
			moduleNameMapper: {
				'^react$': '<rootDir>/node_modules/react',
				'^styled-components$': '<rootDir>/node_modules/styled-components'
			}
		}
	},
	webpack: {
		alias: {
			react: path.resolve('./node_modules/react'),
			'styled-components': path.resolve('./node_modules/styled-components')
		}
	}
};
