process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');

const util = require('util');

const pkg_def = loader.loadSync(`${__dirname}/../src/shared/grpc-calculator.proto`);
const calculator = grpc.loadPackageDefinition(pkg_def).calculator;

const target = `${process.env.PRODUCER_HOST}:${process.env.PRODUCER_PORT}`;

const client = new calculator.CalculatorService(
	target,
	grpc.credentials.createInsecure()
);

describe('Addition', () =>{
	const add = util.promisify(client.add.bind(client));

	describe('when adding two positive whole integers', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await add({ operand1: 5, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should add integers as expected', async () => {
			const response = await add({ operand1: 5, operand2: 1 });
			expect(response.value).to.be.greaterThan(5);
			expect(response.value).to.be.lessThan(7);
			expect(response.value).to.be.equal(6);
		});
	});

	describe('when adding a positive whole integer and a negative whole integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await add({ operand1: 'illegal value', operand2: -6 });
			expect(response.value).to.be.NaN;
		});

		it('should add integers as expected', async () => {
			const response = await add({ operand1: 5, operand2: -6 });
			expect(response.value).to.be.greaterThan(-2);
			expect(response.value).to.be.lessThan(0);
			expect(response.value).to.be.equal(-1);
		});
	});

	describe('when adding two negative whole integers', () => {
		it('should add integers as expected', async () => {
			const response = await add({ operand1: -5, operand2: -6 });
			expect(response.value).to.be.greaterThan(-12);
			expect(response.value).to.be.lessThan(-10);
			expect(response.value).to.be.equal(-11);
		});
	});

	describe('when adding a postive whole integer and a positive fractional integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await add({ operand1: 5.6, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should add integers as expected', async () => {
			const response = await add({ operand1: 5, operand2: 1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(6.6);
			expect(result).to.be.lessThan(6.8);
			expect(result).to.be.equal(6.7);
		});
	});

	describe('when adding a postive whole integer and a negative fractional integer', () => {
		it('should return NaN if incorrect input is given', async () => {
			const response = await add({ operand1: -5.6, operand2: 'illegal value' });
			expect(response.value).to.be.NaN;
		});

		it('should add integers as expected', async () => {
			const response = await add({ operand1: 5, operand2: -1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(3.2);
			expect(result).to.be.lessThan(3.4);
			expect(result).to.be.equal(3.3);
		});
	});

	describe('when adding a negative whole integer and a positive fractional integer', () => {

		it('should add integers as expected', async () => {
			const response = await add({ operand1: -5, operand2: 1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(-3.4);
			expect(result).to.be.lessThan(-3.2);
			expect(result).to.be.equal(-3.3);
		});
	});

	describe('when adding a negative whole integer and a negative fractional integer', () => {

		it('should add integers as expected', async () => {
			const response = await add({ operand1: -5, operand2: -1.7 });

			const result = Number((response.value).toFixed(1));
			expect(result).to.be.greaterThan(-6.8);
			expect(result).to.be.lessThan(-6.6);
			expect(result).to.be.equal(-6.7);
		});
	});
});