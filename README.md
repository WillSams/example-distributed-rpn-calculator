# Example Distributed Reverse Polish Notation Calculator

Clean distributed systems example showcasing:

- **API design** — gRPC backend using Protocol Buffers for fast, strongly-typed communication between server and client
- **Distributed architecture** — clear separation between a stateless gRPC producer (math operations) and a consumer client (RPN interface), designed to support multiple client types
- **Algorithm implementation** — Reverse Polish Notation evaluation on the client, delegating computation to the server via gRPC calls
- **Testing discipline** — BDD-style integration tests with Mocha and Chai, running against a live server spun up via `concurrently`
- **Code hygiene** — ESLint and Prettier enforced via Husky pre-commit hooks
- **Git discipline** — semantic branch naming enforced via GitHub Actions on every PR
- **CI** — lint and full test suite run on every push and PR to `master` via GitHub Actions
- **Dependency management** — Dependabot configured for weekly updates with auto-merge on passing CI

## Pre-requisites

Although Apple Mac links are also provided, the instructions below are more reliable for Debian-based distros (Ubuntu, Linux Mint, etc.) but they can also work under [Windows using the Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about). The following tools need to be installed:

- [Direnv](https://direnv.net) to load environment variables needed for this project. Simply executing `sudo apt install direnv` in your terminal should work in most cases.
- [NodeJS](https://nodejs.org/en/download/)

### Optional - Installing Node Version Manager (NVM)

If you have the version of Node listed in `.nvmrc` installed via some other method, the following instructions are not necessary. Apple Mac instructions can be found [here](https://tecadmin.net/install-nvm-macos-with-homebrew). Otherwise, in your terminal on Debian-based distros or WSL:

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
source ~/.bashrc
```

## Getting Started

Install dependencies:

```bash
nvm use            
npm i
```

Load environment variables:

```bash
direnv allow
```

Start the server:

```bash
npm run server
```

You should see `Producer running at http://127.0.0.1:4000`.

In a second terminal, start the client:

```bash
npm run client
```

You should see `Operands Prompt:`. You can now begin using the calculator:

```bash
Operands Prompt: 5
=>  [ '5' ]
Operands Prompt: 5
=>  [ '5' ]
Operands Prompt: +
=>  10
Operands Prompt: 9
=>  [ '9' ]
Operands Prompt: /
=>  1.7999999523162842
```

To exit, type `exit`:

```bash
Operands Prompt: exit

Shutdown...
```

## Testing

The test suite runs integration tests against a live gRPC server. The server is started automatically alongside the tests via `concurrently`:

```bash
npm test
```

## CI

The project uses GitHub Actions for continuous integration.

- **[pr-validate.yml](./.github/workflows/pr-validate.yml)** — runs on every push and pull request to `master`: installs dependencies, lints with ESLint, and runs the full test suite
- **[branch-name-check.yml](./.github/workflows/branch-name-check.yml)** — enforces semantic branch naming on pull requests (e.g. `feat/`, `fix/`, `chore/`)
- **[dependabot.yml](./.github/dependabot.yml)** — automatically opens weekly PRs to keep npm dependencies up to date
- **[dependabot-auto-merge.yml](./.github/workflows/dependabot-auto-merge.yml)** — auto-merges Dependabot PRs once all checks pass

## License

License information can be found in [LICENSE.md](./LICENSE.md)
