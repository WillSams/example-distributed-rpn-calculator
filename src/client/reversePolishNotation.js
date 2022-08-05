const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');

const util = require('util');

const pkg_def = loader.loadSync(`${__dirname}/../shared/grpc-calculator.proto`);
const calculator = grpc.loadPackageDefinition(pkg_def).calculator;

const target = `${process.env.PRODUCER_HOST}:${process.env.PRODUCER_PORT}`;

const client = new calculator.CalculatorService(
    target,
    grpc.credentials.createInsecure()
);

const add = util.promisify(client.add.bind(client));
const divide = util.promisify(client.divide.bind(client));
const multiply = util.promisify(client.multiply.bind(client));
const subtract = util.promisify(client.subtract.bind(client));

module.exports = (stack = []) => {
    return {
        size: () => stack.length,
        execute: async operand => {
                if (operand[0] === '+') {
                    return add({ operand1: stack.pop(), operand2: stack.pop()}).then(data => {
                        stack.push(data.value);
                        return data.value;
                    });
                }
                if (operand[0] === '/') {
                    return divide({ operand1: stack.pop(), operand2: stack.pop()}).then(data => {
                        stack.push(data.value);
                        return data.value;
                    });
                }
                if (operand[0] === '*') {
                    return multiply({ operand1: stack.pop(), operand2: stack.pop()}).then(data => {
                        stack.push(data.value);
                        return data.value;
                    });
                }
                if (operand[0] === '-') {
                    return subtract({ operand1: stack.pop(), operand2: stack.pop()}).then(data => {
                        stack.push(data.value);
                        return data.value;
                    });
                }
                if (operand[0] === 's') return stack;
            stack.push(operand);
            return operand;
        },
    };
};