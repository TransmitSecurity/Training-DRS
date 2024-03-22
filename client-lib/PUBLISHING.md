# Publishing the private package to GitHub packages

Ideally, you would not need to publish packages manually.
GitHub actions would be configured to do this automatically, and this documentation would only exists to inform administrators and maintainers of this repository on how to publish manually to the private GitHub packages while keeping the automatic versioning.

However, currently, this organization has configured an IP allow list, which makes it [impossible to use hosted runners](https://github.com/orgs/community/discussions/27106).

## Pre-requisites

### Setup a personal access token
Login to your Github account > Settings > Developer Settings > Personal access tokens.
Create a personal access token and save it securely.
Then click on "Configure SSO" and select "transmitsecurity-dev" to authorize this Personal Access Token for this organization.

### Test your access token

```bash
npm login --registry=https://npm.pkg.github.com --scope @transmitsecurity-dev
```

Enter your username and the personal access token as the password.
If the authentication is successful you should see

```
Logged in to scope @transmitsecurity-dev on https://npm.pkg.github.com/.
```

### Publish

Use the following command to publish the package:

```bash
npm run build
NPM_TOKEN=your_token_here GITHUB_TOKEN=${NPM_TOKEN} npx semantic-release --no-ci
```


## Source

For a detailed tutorial, see [this blog](https://shravankashyap.medium.com/creating-and-publishing-your-first-github-private-package-using-lerna-7fd98d62cfe9).