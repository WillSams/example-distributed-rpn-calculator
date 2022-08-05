const { rawListeners } = require('process');
const { createInterface } = require('readline');

const Lexer = require('./lexer');
const rpn = require('./reversePolishNotation');

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.setPrompt('Operands Prompt: ');
readline.prompt();

const rpnCalculator = rpn();

readline
  .on('line', async (line) => {
    if(line === 'exit') { readline.close(); return; }

    try {
      const tokens = new Lexer(line).tokenize();
      const result = await rpnCalculator.execute(tokens);

      console.log('=> ', result);
    } catch (e) {
      console.log('Error:', e);
    }
    readline.prompt();
  })
  .on('close', () => {
    console.log('\nShutdown...');
    process.exit(0);
  });