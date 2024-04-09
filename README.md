# Transmit Security

This repository contains three branches:
- **main**: shows a full Detection and Response integration. This is the solution where the Detection and Response Service is integrated to prevent a session from being used when a risk is detected.
- **adding-drs-starter** is the starting point, a base code to learn how to implement the Transmit Security's Detection and Response Service in a project
- **adding-detection-solution** is the first solution, where the Detection and Response Service is integrated in silent (monitoring) mode. 

## Prerequistes

Software installed:
- git
- NodeJS 18.6+, with npm
- A Javascript IDE, we recommend [VSCode](https://code.visualstudio.com/)

With VScode, we also recommend the plugin [Vue Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) in version 2.0.5.

## Getting started

Clone this repository, make sure to select the branch `adding-drs-starter`

```bash
git clone -b adding-drs-starter https://github.com/TransmitSecurity/Training-DRS.git
```

Install the project dependencies.
Make sure you have NodeJS 18.6 or higher.

```bash
npm install
```

Start the demo

```bash
npm run dev
```

Follow the training !
You also have the documentation in [./docs/add-detection-and-response.md](./docs/add-detection-and-response.md).


## Resources

You can use NVM to manage multiple versions of NodeJS
* [NVM for Windows](https://github.com/coreybutler/nvm-windows)
* [NVM on MacOS](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)