# Transmit Security Axios Client Lib

This **automatically generated** library provides tools to call the [demo server APIs](https://github.com/transmitsecurity-dev/ts-demo-server) without having to manage:
* API endpoints
* Request and responses types

This library was designed to be integrated in any javascript web application, regardless of the framework being used (React, Angular, Vue, Vanilla, etc.).
It is exclusively meant to be used with the [demo server](https://github.com/transmitsecurity-dev/ts-demo-server).

## Prerequisites

This repository and package is hosted on the private repository for the organization **transmitsecurity-dev**.
To use this repository or package, you must be a part of this organization on GitHub.

### OpenVPN

Make sure you have access to https://github.com/transmitsecurity-dev/.
You will need to have OpenVPN activated, which should be the case if you are reading this documentation.

### Personal Access Token

Login to your Github account > Settings > Developer Settings > Personal access tokens.
Create a personal access token and save it securely.
Then click on "Configure SSO" and select "transmitsecurity-dev" to authorize this Personal Access Token for this organization.

### .npmrc

At the root of your project that will install this library (at the same level of your package.json), create a file `.npmrc` with your username and your personal access token:

```ini
//npm.pkg.github.com/:username=MYUSERNAME
//npm.pkg.github.com/:_authToken=MYTOKEN
@transmitsecurity-dev:registry=https://npm.pkg.github.com/
```

Note: some users have had 401 when trying to install, removing the `package-lock.json` can solve the issue.

## Install

Make sure all of the pre-requisites are met.
Install the library with the following command

```bash
npm install @transmitsecurity-dev/ts-demo-client-lib
```

## Using the library

### Services available
This library provides a class for each service available in the demo server.
Currently, the following services are available:
- user
- verification
- registration
- authentication


### Initialize a class
To use a service, instantiate a class by giving it the demo server URL.
The example belows shows how to instantiate the class for the user service:

```js
const userApi = new UserApi(undefined, 'http://localhost:3000')
```

The first parameter which is undefined can contain configuration parameters (apiKey, username, access token, base path), that you would never have to use.

### Use the APIs
Once a class is instantiated, you can use its methods to call the server APIs.

```js
update = await userApi.update({
  name: { first_name: firstName, last_name: lastName },
})
```

### Discovering method names
The library uses Axios under the hood and Typescript, providing you with autocomplete and suggestions.

Note that for each service, the methods are named based on method name used in the demo server controller.

## Generating the library

This library is 100% automatically generated from the OpenAPI specification of the [demo server](https://github.com/transmitsecurity-dev/ts-demo-server).
To generate the library, follow the steps listed below.

Install the dependencies
```bash
npm install
```

Get the latest OpenAPI specification from the demo server by going to its [GitHub page](https://github.com/transmitsecurity-dev/ts-demo-server/blob/main/openapi/generic-spec.json) and clicking on the "download" file. Place the file in `openapi`.

Generate the library with

```bash
npm run generate
```

## Contributing

This library is 100% automatically generated from the OpenAPI specification of the [demo server](https://github.com/transmitsecurity-dev/ts-demo-server).
There is no need to contribute, unless you want to improve the documentation.
Feel free to open [issues](https://github.com/transmitsecurity-dev/ts-demo-client-lib/issues) if you encounter any problem.