# Contribution Guidelines

When contributing to `scribeHC`, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/trevorpfiz/scribeHC/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.

## How to Contribute

### Prerequisites

To not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/trevorpfiz/scribeHC/issues/new/choose) describing the problem you would like to solve.

### Setup your environment locally

_Some commands will assume you have the Github CLI installed, if you haven't, consider [installing it](https://github.com/cli/cli#installation), but you can always use the Web UI if you prefer that instead._

To contribute to this project, you will need to fork the repository:

```bash
gh repo fork trevorpfiz/scribeHC
```

then, clone it to your local machine:

```bash
gh repo clone <your-github-name>/canvas-fhir
```

This project uses [pnpm](https://pnpm.io) as its package manager. Install it if you haven't already:

```bash
npm install -g pnpm
```

Then, install the project's dependencies:

```bash
pnpm install
```

### Implement your changes

This project is a [Turborepo](https://turborepo.org/) monorepo. The code for the CLI is in the `cli` directory, and the docs is in the `www` directory. Now you're all setup and can start implementing your changes.

Here are some useful scripts for when you are developing:

| Command          | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `pnpm dev:cli`   | Builds and starts the CLI in watch-mode                 |
| `pnpm dev:www`   | Starts the development server for the docs with HMR     |
| `pnpm build:cli` | Builds the CLI                                          |
| `pnpm build:www` | Builds the docs                                         |
| `pnpm build`     | Builds CLI and docs                                     |
| `pnpm format`    | Formats the code                                        |
| `pnpm lint`      | Lints the code                                          |
| `pnpm lint:fix`  | Lints the code and fixes any errors                     |
| `pnpm check`     | Checks your code for typeerrors, formatting and linting |

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc... You can use `git status` to double check which files have not yet been staged for commit:

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

### When you're done

Check that your code follows the project's style guidelines by running:

```bash
pnpm check
```

Please also make a manual, functional test of your changes.

If your change should appear in the changelog, i.e. it changes some behavior of either the CLI or the outputted application, it must be captured by `changeset` which is done by running

```bash
pnpm changeset
```

and filling out the form with the appropriate information. Then, add the generated changeset to git:

```bash
git add .changeset/*.md && git commit -m "chore: add changeset"
```

When all that's done, it's time to file a pull request to upstream:

```bash
gh pr create --web
```

and fill out the title and body appropriately. Again, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines for your title.

## Credits

This document was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/CONTRIBUTING.md).
