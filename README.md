# GitPal

> GitPal is an application that allows users to connect with others who are either at the same level or higher to work on open source projects. Users can view current projects, interested users, and pair up to work on a project together.

## Team

  - __Product Owner__: Shaikat Haque
  - __Scrum Master__: Francis Ngo
  - __Development Team Members__: Peter Warner-Medley, Brian Kim

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> __Environment Variables__ GitPal has hardcoded a username of 'neo4j' and a password of 'neo' for neo4j. You can change these in the code or override them by setting the appropriate environment variables. You will also need a GitHub Client ID and Client Secret to use the GitHub API. These, too, are set as environment variables. We have used the .env package, which allows environment variables to be set easily with the .env file in the root directory of the project. An example of the necessary variables for GitPal been provided here in this repo.

- Fork and clone the repo
- Install dependencies from the root of the repo by running
```sh
npm install
```
- [Download](https://neo4j.com/download/community-edition) and install neo4j
- Start the neo4j server (OS dependent)
- Seed the database by running:
```sh
npm run seed
```
- Transpile the JSX files with
```sh
npm run dev
```
> __NOTE__ This sets webpack to watch your /client files for changes
- Run the following command to start the server
```sh
npm start
```
> __NOTE__ This runs nodemon, which will watch server.js and your /server files for changes
- Open localhost:8080 in your browser to start using the application.

## Requirements

- Node 0.10.x
- [neo4j 3.x](https://neo4j.com/download/)

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```
[Download](https://neo4j.com/download/community-edition), install and run neo4j

### Roadmap

View the project roadmap [here](https://github.com/cranebaes/GitPal/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
