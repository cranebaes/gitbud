# GitPal

> GitPal is an application forked from GitBud that allows users to connect with others who are either at the same level or higher to work on open source projects. Users can view current projects, interested users, and pair up to work on a project together.

![Alt text](https://s3.amazonaws.com/poly-screenshots.angel.co/Project/c6/610187/7b1e3bb1d52fba7f60c382df3dc03a0b-original.png)

## Table of Contents

1. [Team](#team)
1. [Preview](#preview)
    1. [Demo](#demo)
    1. [Screenshots](#screenshots)
1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
    1. [Roadmap](#roadmap)
1. [More Information](#more-information)
    1. [Server README](#server-readme)
    1. [Client README](#client-readme)
1. [GitBud Repo](#gitbud-repo)
1. [Contributing](#contributing)

## Team

  - __Product Owner__: Scott Schaefer
  - __Scrum Master__: Rick Gallegos
  - __Development Team Members__: Christine Zimmerman, Scott Mitchell, Sonrisa Chen

## Preview

### Demo

Click [here](https://gitpal.herokuapp.com/) to try out GitPal

### Screenshots

[Sample projects](https://s3.amazonaws.com/poly-screenshots.angel.co/Project/c6/610187/3857f3ab5dc89ba8668d64090a631d09-original.png)

[Project page](https://s3.amazonaws.com/poly-screenshots.angel.co/Project/c6/610187/2e76e08872778c681adc67e8eb0edac7-original.png)

[User Profile](https://s3.amazonaws.com/poly-screenshots.angel.co/Project/c6/610187/f8b4f7744d08fe5d166b127b7ca88fdd-original.png)

[Navigation Drawer](https://s3.amazonaws.com/poly-screenshots.angel.co/Project/c6/610187/1177499d4beb39863b539f274faf0d9a-original.png)

[My Partners page](https://s3.amazonaws.com/poly-screenshots.angel.co/Project/c6/610187/b762fd98fafa7ec781ca2af220a948f6-original.png)

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

View the project roadmap [here](https://github.com/Toucans456/GitPal/issues)

## More Information

### Server README

View the GitPal server README [here](client/README.md)

### Client README

View the GitPal client README [here](server/README.md)

## GitBud Repo

View the original Repo
[here](https://github.com/cranebaes/gitbud/)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
