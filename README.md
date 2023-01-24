# Example Distributed Reverse Polish Notation Calculator

A high-level description of your solution

This is my implementation of a Reverse Polish Notation (or "RPN") calculator, utilizing a gRPC API as the backend for fast, high performance calculator that can use many clients.  The gRPC API only implements the math functions (add, divide, multiply, subtract, etc.) while the client application implements the interface that requires the RPN functionality.  So, we have two very clear and distinctive interfaces for the server and client, with the capability of adding even more types of client applications that may require the server backend.

## Pre-requisites

Although Apple Mac links are also provided, the instructions below are more reliable for Debian-based distros (Ubuntu, Linux Mint, etc.) but they can also work under [Windows using the Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about).  The following tools need to be installed:

- [Direnv](https://direnv.net) to load environment variables needed for this project.  Simply executing `sudo apt install direnv` in your terminal (command line) should work in most cases.
- [NodeJS](https://nodejs.org/en/download/).

### Optional - Installing Node Version Manager (NVM)

If you have the version of Node listed in `.nvmrc` installed via some other method, the following instructions are not necessary.  Apple Mac instructions can be found [here](https://tecadmin.net/install-nvm-macos-with-homebrew).  Otherwise, in your terminal on Debian-based distros or WSL:

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
source ~/.bashrc
```

### Install Node Packages

Execute the following within your terminal:

```bash
 # To eliminate any issues, install/use the version listed in .nvmrc.  
 # If you need to install the listed version of Node, execute `nvm install <version-listed-in-.nvmrc>`
nvm use            

npm i               # Install the packages needed for the project
```

### Getting Started

In a terminal window, navigate to the project's root and execute 

```bash
direnv allow  # if this doesn't work, re-check your Direnv install steps above
npm run server
```

You should see an eventual dialog stating `Producer running at http://127.0.0.1:4000`.

In a second terminal window, execute the following:

```bash
npm run client
```

In this secondary terminal, you should see `Operands Prompt:`.  You can now begin using the calculator.

```bash
Operands Prompt: 5
=>  [ '5' ]
Operands Prompt: 5
=>  [ '5' ]
Operands Prompt: +
=>  10
Debugger attached.
Operands Prompt: 5
=>  [ '5' ]
Operands Prompt: 9
=>  [ '9' ]
Operands Prompt: /
=>  1.7999999523162842
```

To exit the operands prompt, type `exit`.

```bash
> example-grpc-rpn-calculator@1.0.0 client
> node src/client/app.js

Operands Prompt: exit

Shutdown...
```

### Testing

Included integration tests to calls to the server functions from the client are working as intended.  Before executing tests, start an instance of the server (i.e, `npm run server`) in a terminal window and in another window, execute `npm run test`.
