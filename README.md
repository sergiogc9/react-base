## Getting started

1. First, install the correct NodeJS version. You can check the version in `.nvmrc` file.

2. Install the necessary packages and dependencies:

	``` npm install ```

3. Configure environment variables and configurations:

   ```npm run env development```

4. Start the development server:

	```npm start```

⚠️ By default the server runs over HTTPS. To avoid warnings related to untrusted certificate, you should add the certificate in your system as a secure certificate.
The process may vary depending on the browser and the OS.

## Available scripts

### `npm start`

Runs the app in the development mode.<br />
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run env $ENV`

Generates the environment and config files necessary to run the application in the desired environment. It creates a non git tracked `.env` file at root directory.

Valid environment values are `dev`, `pre`, `staging` and `prod`.

### `npm test`

Runs all unitary tests from components, store and libs. It also checks the coverage of the code.<br>

It can be executed only for desired tests, using a pattern: `npm test user.test.ts`

### `npm run test:local`

Runs all unitary tests from components, store and libs in watch mode (i.e. testing again automatically when editing the code). It does not check the code coverage.<br>

It can be executed only for desired tests, using a pattern: `npm test:local user.test.ts`

### `npm run test:local:file $file`

Runs `npm run test:local` including all tests in the repo. Running without the `file` parameter, will run all tests including the puppeteer ones making the test to fail.<br>

The goal of this script is to only run tests matching the `file` parameter pattern.

Example to only execute tests for Focus component:<br/>
`npm run test:local:file Focus.test.tsx` <br/>

If pattern matches any puppeteer test, run including the `__tests__` directory:<br/>
`npm run test:local:file __tests__/.*/Focus.test.tsx`

🛈 You can force doing the coverage check by adding `-- --coverage` at the end of the command.

### `npm run build`

Builds the app for production into the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run storybook`

Runs storybook in a local server in watch mode.<br>
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

### `npm run build-storybook`

Builds the storybook for production into the `storybook-static` folder.
