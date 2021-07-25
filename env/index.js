const fs = require('fs');
const path = require('path');

const environment = process.argv[2];

const environmentsAvailable = ['prod', 'staging', 'pre', 'dev'];

if (environmentsAvailable.indexOf(environment) === -1) {
	// eslint-disable-next-line no-console
	console.warn(`Wrong environment (${environment}). Available environments [ ${environmentsAvailable.join(' | ')} ]`);
	process.exit(1);
}

const source = path.resolve(__dirname, `./${environment}`);
const target = path.resolve(__dirname, '../.env');

fs.writeFileSync(target, fs.readFileSync(source));

process.exit(0);
