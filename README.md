# RateMyStocks

[ratemystocks.com](https://ratemystocks.com) is a community-driven stock market research platform and investor social network.
This is a Nx monorepo that contains a NestJS backend API that connects to a PostgreSQL database, and an Angular UI that consumes the API.

For more info on our development processes, visit our [wiki](https://github.com/RateMyStocks/ratemystocks/wiki)

![ratemystocks example screenshot](https://gabelorenzo.github.io/assets/images/portfolio/ratemystocks-stock-page.png)

# Getting Started

## Recommended Workspace Setup

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the `Workspace Recommendations` which are plugins specified in the `.vscode/extensions.json` file. When you open the project in VS Code, a prompt at the bottom right saying "Do you want to install the recommended extensions for this repository?". When you see this,

# Prerequisites

1. Install Node.js & npm: [Node.js Download](https://nodejs.org/en/download/). Currently this application is verified to work with `Node v14.x` & `npm v6.x` & may or may not work fine with the latest versions.
2. Install Angular CLI: `npm install -g @angular/cli`. Currently this application is on `Angular 12`, but it may be fine to use later versions of the CLI.
3. Install Nx CLI Globally: `npm install -g nx`.
4. Install Docker: [Docker Download](https://docs.docker.com/get-docker/).
5. (Optional) Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

# Running the app locally

1. `cd` into the root directory of the project from a command line.
2. `npm install` - Install the dependencies in the local node_modules folder.
3. Create a `.env` file based off of `.env.example`. You will need to update this file with your API keys for all the 3rd-party APIs we use - Contact us to get setup with API keys.
4. `docker-compose up -d` - This will run the Postgres database & Redis cache as containers in the background. NOTE: You don't need to run this command every time you run the app, only if the containers have stopped (run `docker-compose down` to stop them). As long as the containers are running, the app should be able to connect.
5. `npm run dev` - This will run NestJS (backend) & Angular (frontend) dev servers in parallel, both in watch mode.
6. Go to `localhost:4200` in your browser. `IMPORTANT`: Makes sure you are not connected to any VPN - it might block your requests made to the 3rd party APIs we use.

# Common Tasks

## Common Nx commands

- Generate NestJS module `ng g @nrwl/nest:module app/modules/<MODULE-NAME> --project=backend`
- Generate Angular component `ng g c modules/<MODULE-NAME>/<COMPONENT-NAME>`

## Generating TypeORM Migrations:

1. Update or add a new .entity.ts file.
2. Import the new enitity into the `entities` array of `ormconfig.ts`.
3. Generate a Migration file under the src/migration directory using `npm run typeorm:migration:generate -- Some_Migration_Name` (replace Some_Migration_Name with something appropriate). This will automatically create a new migration file with SQL statements to update the schema and rollbacks to revert those changes.
4. Import the new migration into the `migrations` array of `ormconfig.ts`.
5. Since we have `migrationsRun: true` in `ormconfig.ts`, you just have to run the application to run the migrations. If you for some reason do need to run migrations manually, you can do `npm run typeorm:migration:run`.

## Heroku

1. Login to Heroku to use the CLI: `heroku login`
2. Heroku Exec (SSH Tunneling) - Remotely connect to Heroku web dyno: `heroku ps:exec -a <heroku-environment-name>`
3. Tail Heroku Logs in Real-Time: `heroku logs --tail -a <heroku-environment-name>`
4. Remotely connect to Heroku Postgres database: `heroku pg:psql -a <heroku-environment-name>`
5. See Heroku config vars: `heroku config -a <heroku-environment-name>`

## Accessing pgAdmin

1. After you have run `docker-compose up`, navigate to `http://localhost:5050/` and login with the admin credentials specified in the docker-compose.yml (see the values for `PGADMIN_DEFAULT_EMAIL` & `PGADMIN_DEFAULT_PASSWORD`).

# Nx

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Powerful, Extensible Dev Tools**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@ratemystocks/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## ☁ Nx Cloud

### Computation Memoization in the Cloud

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# Angular CLI Help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
