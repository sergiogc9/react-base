ℹ️ This repository has the boilerplate code based on React (CRA), Typescript, jest and others for my personal projects.

It uses other personal React projects:

- [React UI Library](https://github.com/sergiogc9/react-ui)
- [React Libraries](https://github.com/sergiogc9/react)

## Getting started

1. First, install the correct NodeJS version. You can check the version in `.nvmrc` file.

2. Install the necessary packages and dependencies:

   `yarn install`

3. Configure environment variables and configurations:

   `yarn env dev`

4. Install certificates:

   You can install local certificates in many ways. Our proposal is to use `mkcert`, which can be installed following the instructions [here](https://github.com/FiloSottile/mkcert).

   Once installed, follow these steps:

   ```
   # Install the CA certificate in the local trust store
   mkcert -install

   # Create .cert directory if it doesn't exist (unix command)
   mkdir -p .cert

   # Generate the certificate (run from the root of this project)
   mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem "localhost"
   ```

5. Start the development server:

   `yarn start`

⚠️ By default the server runs over HTTPS. To avoid warnings related to untrusted certificate, you should add the certificate in your system as a secure certificate.
The process may vary depending on the browser and the OS.

## Available scripts

### `yarn start`

Runs the app in the development mode.<br />
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn env $ENV`

Generates the environment and config files necessary to run the application in the desired environment. It creates a non git tracked `.env` file at root directory.

Valid environment values are `dev` and `prod`.

### `yarn test`

Runs all unitary tests from components, store and libs. It also checks the coverage of the code.<br>

It can be executed only for desired tests, using a pattern: `yarn test user.test.ts`

### `yarn test:local`

Runs all unitary tests from components, store and libs in watch mode (i.e. testing again automatically when editing the code). It does not check the code coverage.<br>

It can be executed only for desired tests, using a pattern: `yarn test:local user.test.ts`

### `yarn test:local:file $file`

Runs `yarn test:local` including all tests in the repo. Running without the `file` parameter, will run all tests including the puppeteer ones making the test to fail.<br>

The goal of this script is to only run tests matching the `file` parameter pattern.

Example to only execute tests for Focus component:<br/>
`yarn test:local:file Focus.test.tsx` <br/>

If pattern matches any puppeteer test, run including the `__tests__` directory:<br/>
`yarn test:local:file __tests__/.*/Focus.test.tsx`

🛈 You can force doing the coverage check by adding `--coverage` at the end of the command.

### `yarn build`

Builds the app for production into the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn analyze`

Analyzes the build and its content.<br>
It has to be executed after a build is built.

### `yarn link:ui`

Links the `@sergiogc9/react-ui*` related packages to local installation for development purposes. The links must be created in the other project to let this work.<br>
After executing this script, you will be using the local build, whatever version is set in the package.json.

### `yarn unlink:ui`

Removes any existing link to `@sergiogc9/react-ui*` local project. <br>
It forces a reinstallation of the packages. After executing this script you will be using the published package based on version set in package.json.

### `yarn link:utils`

Links the `@sergiogc9/react*` related packages to local installation for development purposes. The links must be created in the other project to let this work.<br>
After executing this script, you will be using the local build, whatever version is set in the package.json.

### `yarn unlink:utils`

Removes any existing link to `@sergiogc9/react*` local project. <br>
It forces a reinstallation of the packages. After executing this script you will be using the published package based on version set in package.json.

### `yarn update-lang`

Pulls the language locales data from PhraseApp and puts them into `src/i18n/locales/$LANG.json` to be used by the application. You should add the necessary credentials inside the script file.

### `yarn lint`

Checks lint in all files except those ignored by gitignore.

### `yarn prettier`

Runs the prettier formatter through the whole project.

### `yarn prettier:check`

Checks that all files have been formatted using prettier. If some file is pending to format, the command fails.
