# Contributing to DogeHouse
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:
- Reporting an issue
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Code of Conduct
The code of conduct is described in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Our Development Process
All changes happen through pull requests. Pull requests are the best way to propose changes. We actively welcome your pull requests and invite you to submit pull requests directly [here](https://github.com/firecraftgaming/battleship-royale/pulls), and after review, these can be merged into the project.

## Using the Project's Standard Commit Messages
This project is using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standard. Please follow these steps to ensure your

## Pull Requests
1. Fork the repo and create your branch (usually named `patch-%the number of PRs you've already made%`) from `main`.
2. If you've added code that should be tested, add some test examples.
3. Ensure to describe your pull request.


## Quickstart Local Frontend Development
Do this if you only want to do React stuff and don't want to touch Elixir:

### UI *(react + next.js)*:
Navigate to `/toast`

- Run `npm i`
- Run `npm run dev` (this tells React to connect to a hosted version of the backend for development purposes).
- Read `toast/README.md` for more information and fixes for known development issues.

### Run
#### `pancake`
```shell
$ mix deps.get
$ iex -S mix
```
#### `toast`
```shell
$ npm i
$ npm run dev
```

## Manual Full Local Development
How to run locally:

### Backend
#### Elixir
Elixir installation guide [here](https://elixir-lang.org/install.html).

#### `pancake`
Navigate to `/pancake` and set the following environment variables:

Run the following command:
```shell
$ mix deps.get
```

Start the server
```shell
$ iex -S mix
```

## Issues
We use GitHub issues to track public bugs. Please ensure your description is
clear and has sufficient instructions to be able to reproduce the issue. Report a bug by <a href="https://github.com/firecraftgaming/battleship-royale/issues">opening a new issue</a>; it's that easy!

## Feature Request
Great Feature Requests tend to have:

- A quick idea summary.
- What & why you wanted to add the specific feature.
- Additional context like images, links to resources to implement the feature etc, etc.

## License
By contributing to Battleship Royale, you agree that your contributions will be licensed
under the [LICENSE file](LICENSE).
