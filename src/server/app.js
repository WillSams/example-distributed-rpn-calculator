const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');

const pkg_def = loader.loadSync(`${__dirname}/../shared/grpc-calculator.proto`);
const calculator = grpc.loadPackageDefinition(pkg_def).calculator;

const { add, divide, multiply, subtract, squareRoot } = require('./calculator');

const host = process.env.PRODUCER_HOST;
const port = process.env.PRODUCER_PORT;

const server = new grpc.Server();

server.addService(calculator.CalculatorService.service, {
  add: (root, callback) => {
    const result = add(root.request.operand1, root.request.operand2);
    callback(null, { value: result });
  },
  divide: (root, callback) => {
    const result = divide(root.request.operand1, root.request.operand2);
    callback(null, { value: result });
  },
  multiply: (root, callback) => {
    const result = multiply(root.request.operand1, root.request.operand2);
    callback(null, { value: result });
  },
  subtract: (root, callback) => {
    const result = subtract(root.request.operand1, root.request.operand2);
    callback(null, { value: result });
  },
  squareRoot: (root, callback) => {
    const result = squareRoot(root.request.value);
    callback(null, { value: result });
  },
});

server.bindAsync(
  `${host}:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) throw err;

    server.start();
    console.log(`Producer running at http://${host}:${port}`);
  }
);
