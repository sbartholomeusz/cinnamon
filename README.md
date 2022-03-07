# Cinnamon - Toastmasters Meeting Agenda Generator
[![GitHub Action status](https://github.com/sbartholomeusz/cinnamon/workflows/ci-cd/badge.svg)](https://github.com/sbartholomeusz/cinnamon/actions)

![Banner](/docs/git-repo-banner.png?raw=true "")

## Overview
Cinnamon is a self-contained Angular SPA web application for generating Toastmasters Meeting Agendas. <br />
https://sbartholomeusz.github.io/cinnamon/
<br /> <br />

The application was developed with the following constraints in mind:
* Toastmasters International does not provide official tools to generate club meeting agendas (at least at the time of development).
* The solution must be easy to access, and therefore ideally web based.
* Toastmasters Clubs are run by volunteers therefore minimising the complexity and on-going maintenance of the application is vital. A self-contained solution would be the most ideal option.
* Hosting costs for the web application should also be minimised.
<br /> <br />

Notable third party dependencies include:
* print-js - https://www.npmjs.com/package/print-js
* awesome-qr - https://www.npmjs.com/package/awesome-qr
* angular-cli-ghpages - https://www.npmjs.com/package/angular-cli-ghpages
<br /> <br /> 

![Banner](/docs/app-screenshot-1.png?raw=true "")

![Banner](/docs/app-screenshot-2.png?raw=true "")

![Banner](/docs/app-screenshot-3.png?raw=true "")

<br />

## Configurations
Please take note of the following configuration files that will require amending.
* Toastmasters Club JSON data file - ```\src\src\assets\tm-club.json```
<br /> 

## How to: Run the web application locally
1. Clone the repo
```console
git clone https://github.com/sbartholomeusz/cinnamon
```
<br /> 

2. Install dependencies
```console
cd cinnamon\src\
npm install
```
<br />

3. Serve the angular web application
```console
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
<br /><br /> 

## How to: Build the solution
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
<br /><br /> 

## How to: Run unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
<br /><br /> 

## How to: Debug unit tests
Run `ng test --browsers ChromeDebug` to execute the unit tests via [Karma](https://karma-runner.github.io).
<br /> 
Then run script `ng test debug`.

